# ladder-spectra

This piece has a theme of reclamation, it's pulling me out of a statis; it's dusting off my soul.

There are six metal plates that I've gathered from an old ladder bookshelf that was to be discared. There were actually fourteen metal plates in total, but I chose six of the fourteen based on their spectral qualities. It is worth mentioning that plates were meant to hold books and were not meant to be used as an instrument, but it's because of that's what makes them interseting to me. The plates are all identical according to steel bookshelf manufacturing standards, but those standards are what makes them interesting. Each plate has it's own harmonic spectrum and they're all slightly different from another. If we're looking at the most prevelant frequency of the metal plates, then the pitch differenc between the lowest plate and the highest plate is almost 35 cents. When looking at the prevelant partials of the plates it's extremely difficult to decipher a harmonic series.



Install ChucK on a Raspberry Pi
----------------------------------

Adding ChucK install instructions because this is usually a pain to figure out. First install some dependencies.

    sudo apt-get install bison flex
    sudo apt-get install alsa-base libasound2-dev libsndfile1-dev

Clone the ChucK repository to a suitable directory.

    git clone https://github.com/ccrma/chuck

Now we can change to the `chuck/src` directory and build the makefile.

    cd chuck/src
    make linux-alsa

After it is built, install it.

    sudo make install linux-alsa

ChucK is used for serial communication to the Arduinos and recieves OSC communication from Max/MSP.
Max/MSP is used for composition and generative / algorithmic processes that control the three Arduinos and eighteen solenoids.
Python is used for analyzing the spectra and deciphering the prevelant harmonics of the harmonic plates.
