from scipy.io import wavfile
from analyze import calculate_harmonics

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import math

num_peaks = 7
fundamentals = []

matplotlib.rc('font', size=4)
fig, axs = plt.subplots(6, 2, sharex=True, sharey=True)
fig.suptitle('center')

for idx in range(1, 13):
    filename = './../audio/' + str(idx) + '-center.wav'
    fs, x = wavfile.read(filename)
    X, props = calculate_harmonics(fs, x, num_peaks)

    # plotting
    freq_bin = props['freq_bin']

    y = X
    x = np.arange(0, X.size, 1)

    row = (idx - 1) // 2
    col = (idx - 1) % 2
    axs[row, col].set_ylim([0.4, 1.1])
    axs[row, col].plot(x * freq_bin, y)

    x = props['peaks']
    y = X[props['peaks']]

    axs[row, col].plot(x * freq_bin, y, 'ro', markersize=1)
    for hz, mag in zip(x * freq_bin, y):
         axs[row, col].annotate('%.2f' % hz, xy=(hz,mag), xytext=(hz+35,mag), horizontalalignment='left', verticalalignment='center')

plt.savefig('center.png', dpi=1200, bbox_inches='tight')
