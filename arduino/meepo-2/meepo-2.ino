// meepo
// for controlling the meepo board serial messages

#define arduinoID 2
#define NUM_SOLENOIDS 6

#include <avr/interrupt.h>
#include <avr/io.h>

#define LED_POWER 12
#define LED_STATUS 13

char bytes[2];
short notes[NUM_SOLENOIDS];

int statustimer = 0;

// actuator pins
int actuators[] = {
  3, 5, 6, 9, 10, 11
};

void setup() {
  // serial
  Serial.begin(9600);

  // interrupt timer parameters
  TCCR2A = 1;
  TCCR2B = 3;
  TIMSK2 = 1;

  pinMode(LED_POWER, OUTPUT);
  pinMode(LED_STATUS, OUTPUT);
  digitalWrite(LED_POWER, LOW);

  for (int i = 0; i < NUM_SOLENOIDS; i++) {
    pinMode(actuators[i], OUTPUT);
    digitalWrite(actuators[i], LOW);
  }
}

// this timer allows for concurrency
// solenoids can stay high while new
// serial messages are read
ISR(TIMER2_OVF_vect) {
  for (int i = 0; i < NUM_SOLENOIDS; i++) {
    if (notes[i] > 0) {
      digitalWrite(actuators[i], HIGH);
      notes[i]--;
    } else {
      digitalWrite(actuators[i], LOW);
    }
  }
  if (statustimer > 0) {
    digitalWrite(LED_STATUS, HIGH);
    statustimer--;
  } else {
    digitalWrite(LED_STATUS, LOW);
  }
}

void loop() {
  if (Serial.available()) {
    digitalWrite(LED_STATUS, HIGH);

    // parity byte
    if (Serial.read() == 0xff) {
      // reads in a two byte index array
      Serial.readBytes(bytes, 2);

      // reads the first six bits for the note number
      // then reads the last ten bits for the note velocity
      int note = byte(bytes[0]) >> 2;
      int velocity = (byte(bytes[0]) << 8 | byte(bytes[1])) & 1023;

      // message that returns Arduino ID to host program
      // allows for a single program to control multiple meepos

      if (note == 63 && velocity == 1023) {
        Serial.write(arduinoID);
      }

      if (note >= 0 && note <= NUM_SOLENOIDS) {
        statustimer = 120;
        notes[note] = (velocity * 0.5);
      }
    }
  }
}
