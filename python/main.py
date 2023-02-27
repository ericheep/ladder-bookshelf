from scipy.io import wavfile
from analyze import calculate_harmonics

import matplotlib
import matplotlib.pyplot as plt
import numpy as np

matplotlib.rc('font', size=8)
num_peaks = 1
fundamentals = []

for i in range(1, 12):
    filename = './../audio/' + str(i) + '-corner.wav'
    fs, x = wavfile.read(filename)
    harmonics, weights = calculate_harmonics(fs, x, num_peaks)
    print(harmonics)


# plotting
# y = x
# x = np.arange(0, x.size, 1)
# plt.plot(x * freq_bin, y)

# x = peaks[peak_indices]
# y = x[peaks[peak_indices]]
# labels = peak_freqs[peak_indices]

# plt.plot(x * freq_bin, y, 'ro', label=labels, markersize=2)
# for i, j in zip(x * freq_bin, y):
#     plt.annotate('%.2f' % i, xy=(i,j), xytext=(i+25,j), horizontalalignment='left', verticalalignment='center')

# plt.show()
