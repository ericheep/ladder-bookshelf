"""analyze.py
"""

import numpy as np
from math import ceil
from numpy import r_
from scipy import signal
from scipy.fft import rfft, fft
from scipy.signal import find_peaks


def calculate_harmonics(fs, x, num_peaks):
    # quarter second onset
    onset = fs // 8

    # cut off the attack
    x = x[onset:]

    # shrink file to 4 seconds
    x = x[:int(fs * 4.75)]

    # 1024 * 64
    N = 131072 // 2
    freq_bin = fs / N

    # X = stft(x, mode='p', N=N, zeropad=False)[0]
    X = rfft(x)
    N = X.size * 2
    freq_bin = fs / N

    # discard imaginary numbers
    X = np.real(X)

    # log scaling
    X = X - np.min(X)
    X = np.log(X * 20)

    # truncate spectrum
    upper_cutoff = int(4000 / freq_bin)
    X = X[:upper_cutoff]

    # average all the columns
    # X = np.mean(X, axis=1)

    # normalize array
    # X = X - np.min(X)
    X = X / np.max(X)

    # silence noise below 300hz
    lower_cutoff = int(300 / freq_bin)
    X[:lower_cutoff] = 0

    # get peaks
    mu = np.mean(X[lower_cutoff:])

    peaks, props = find_peaks(X, height=mu + 0.15)

    if (peaks.size < num_peaks):
        highest_peaks_num = peaks.size

    peak_heights = props['peak_heights']
    peak_indices = np.argpartition(peak_heights, -num_peaks)[-num_peaks:]

    # scale back to frequency range
    peak_freqs = peaks * freq_bin

    return peak_freqs[peak_indices], peak_heights[peak_indices]
