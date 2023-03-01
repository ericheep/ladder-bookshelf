"""analyze.py
"""

import numpy as np
from math import ceil
from numpy import r_
from scipy import signal
from scipy.fft import rfft, fft
from scipy.signal import find_peaks


def calculate_harmonics(fs, x, num_peaks, lo, hi):
    # quarter second onset
    onset = fs // 8

    # cut off the attack
    x = x[onset:]

    # shrink file to 4 seconds
    x = x[:int(fs * 4.875)]

    # real fft, returns up to nyquist
    X = rfft(x)

    # get fft size
    N = X.size * 2
    freq_bin = fs / N

    # truncate spectrum
    upper_cutoff = int(hi / freq_bin)
    X = X[:upper_cutoff]

    # fix em up
    X = np.real(X)
    X = X**2
    X = np.log(X)

    X = X - np.min(X)
    X = X / np.max(X)

    # filter low energy
    lower_cutoff = int(lo / freq_bin)
    X[:lower_cutoff] = 0

    # get peaks
    mu = np.mean(X)
    peaks, peak_props = find_peaks(X, height=mu, prominence=0.125, distance=100)

    if (peaks.size < num_peaks):
        num_peaks = peaks.size

    peak_heights = peak_props['peak_heights']
    peak_indices = np.argpartition(peak_heights, -num_peaks)[-num_peaks:]

    # scale back to frequency range
    peak_freqs = peaks * freq_bin

    props = dict()

    props['freq_bin'] = freq_bin
    props['harmonics'] = peak_freqs[peak_indices]
    props['weights'] = peak_heights[peak_indices]
    props['peaks'] = peaks[peak_indices]

    return X, props
