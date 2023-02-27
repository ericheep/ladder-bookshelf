from scipy.io import wavfile
from analyze import calculate_harmonics

import matplotlib
import matplotlib.pyplot as plt
import numpy as np

num_peaks = 1
fundamentals = []

for i in range(1, 12):
    filename = './../audio/' + str(i) + '-corner.wav'
    fs, x = wavfile.read(filename)
    X, props = calculate_harmonics(fs, x, num_peaks)
    print(props['harmonics'])

# filename = './../audio/1-corner.wav'
# fs, x = wavfile.read(filename)
# X, props = calculate_harmonics(fs, x, num_peaks)

# plotting
freq_bin = props['freq_bin']
matplotlib.rc('font', size=8)

y = X
x = np.arange(0, X.size, 1)
plt.plot(x * freq_bin, y)

x = props['peaks']
y = X[props['peaks']]

plt.plot(x * freq_bin, y, 'ro', markersize=2)
for i, j in zip(x * freq_bin, y):
     plt.annotate('%.2f' % i, xy=(i,j), xytext=(i+25,j), horizontalalignment='left', verticalalignment='center')

# plt.show()
