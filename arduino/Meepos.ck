// Meepos.ck
// Eric Heep, May 2023

// this is code that was reconfigured from the robots code I wrote for CalArts back in 2016
// while  I still <3 ChucK, here it s mostly used as a server for Serial communication
// it is so very good at serial communication

// in use it is really just an OSC listener from Max/MSP,
// a softare I have grown more acustom to over the years


class Meepos {

  SerialIO.list() @=> string list[];
  int serialPorts[list.cap()];

  // calls num_ports() to find how many USB ports are available
  SerialIO serial[num_ports()];
  int robotID[serial.cap()];

  fun void init() {
    for (0 => int i; i < robotID.size(); i++) {
      i => robotID[i];
    }
    openPorts();
    2.5::second => now;
    handshake();
  }

  // returns the proper robot ID to the child class
  fun int port(int ID) {
    return serialPorts[robotID[ID]];
  }

  // returns how many usb serial connections are available
  fun int num_ports() {
    int num;
    for (0 => int i; i < serialPorts.size(); i++) {
      if (list[i].find("usb") > 0) {
        i => serialPorts[num];
        num++;
      }
    }
    <<< "found", num, "available USB ports:", "" >>>;
    return num;
  }

  // opens only how many serial ports there are usb ports connected
  fun void openPorts() {
    for (0 => int i; i < serial.cap(); i++) {
      if (!serial[i].open(serialPorts[i], SerialIO.B57600, SerialIO.BINARY)) {
        <<< "unable to open serial device:", "\t", list[serialPorts[i]] >>>;
      } else {
        <<< "opened serial device:", "\t", list[serialPorts[i]] >>>;
      }
    }
  }

  // pings the Arduinos and returns their 'arduinoID'
  fun void handshake() {
    [255, 255, 255] @=> int trioEights[];
    for (0 => int i; i < serial.cap(); i++) {
      serial[i].writeBytes(trioEights);
      serial[i].onByte() => now;
      serial[i].getByte() => int arduinoID;

      arduinoID => robotID[i];

      if (arduinoID > 0) {
        <<< "sent handshake to arduino and received an ID of", arduinoID >>>;
      }
    }
  }

  // bitwise operations, allows note numbers 0-63 and note velocities 0-1023
  fun void note(int ID, int num, int vel) {
    int bytes[3];
    0xff => bytes[0];
    (num << 2) | (vel >> 8) => bytes[1];
    vel & 255 => bytes[2];
    serial[ID].writeBytes(bytes);
  }
}


Meepos meeps;
meeps.init();

OscIn in;
OscMsg msg;

5432 => in.port;
in.listenAll();

while (true) {
  in => now;

  while(in.recv(msg)) {
    if (msg.address == "/sol") {
      msg.getInt(0) => int arduino;
      msg.getInt(1) => int note;
      msg.getInt(2) => int vel;

      meeps.note(arduino, note, vel);
    }
  }
}
