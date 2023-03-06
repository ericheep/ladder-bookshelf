# ladder-spectra

Six metal plates hang from red nylon string, underneath each is a tower of bricks with three solenoids primed to strike at different points on each plate. The plates are from a disassembled ladder steel bookshelf that sat around unused for years - but upon dissasembly of this bookshelf, the spectral peculiarity of these plates became apparent.

There were actually fourteen metal plates gathered from that bookshelf, but I chose six of those fourteen plates based on their spectral qualities. Each of the fourteen plates was struck in three different points that emphasized different sets of harmonics - those strikes were recorded and the resulting recordings were anaylzed to find their most prevalent partials. From that information the composition is formed and the arrangement of the plates was considered.

It is worth mentioning that plates were meant to hold books and were not meant to be used as an instrument, and that is what makes them interesting to me. Assumingly the plates are formed using the same manufaturing process, but their manufacturing standards did not consider their use as an instrument. This resulted in a collection of plates that are all delightfully detuned from each other. I found that each plate has its own peculiar non-linear harmonic series.

I suppose this piece isn't too experiemental, but one goal is to allow for an appreciation of the varying spectra due to the precision of the mechatronic strikes and the sparsity of the composition.


How to Run the Python Analysis
----------------------------------

I used Python 3.9.6 with numpy, scipy, and matplotlib

How to ChucK on a Raspberry Pi
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


Tech Recap
----------------------------------

ChucK is used for serial communication to the Arduinos and recieves OSC communication from Max/MSP.
Max/MSP is used for composition and generative / algorithmic processes that control the three Arduinos and eighteen solenoids.
Python is used for analyzing the spectra and deciphering the prevelant harmonics of the harmonic plates.
Also included are the STLs used for the 3D printing.

This piece has a theme of reclamation, it's pulling me out of a statis; it's dusting off my soul.

