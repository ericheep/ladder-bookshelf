// server.ck
// Eric Heep, May 2023

// this is code that was reconfigured from the robots code I wrote for CalArts back in 2016
// while  I still <3 ChucK, here it s mostly used as a server for Serial communication
// it is so very good at serial communication

// in use it is really just an OSC listener from Max/MSP,
// which is a software I have grown more acustom to over the years


class Meepos {

  SerialIO.list() @=> string list[];
  int serialPorts[list.size()];

  // calls num_ports() to find how many USB ports are available
  SerialIO serial[num_ports()];
  int robotID[serial.size()];

  fun void init() {
    for (0 => int i; i < robotID.size(); i++) {
      i => robotID[i];
    }
    openPorts();
    2.5::second => now;
    handshake();
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
    for (0 => int i; i < serial.size(); i++) {
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
    for (0 => int i; i < serial.size(); i++) {
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
    -1 => int serialIndex;

    if (ID < robotID.size()) {
      if (robotID[ID] < serialPorts.size()) {
        serialPorts[robotID[ID]] => serialIndex;
      }
    }

    if (serialIndex >= 0) {
      int bytes[3];
      0xff => bytes[0];
      (num << 2) | (vel >> 8) => bytes[1];
      vel & 255 => bytes[2];
      serial[serialIndex].writeBytes(bytes);
    } else {
      <<< "arduino ID", ID, "not found", "" >>>;
    }
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
      <<< arduino, note, vel, "" >>>;
    }
  }
}
