# Eric Heep Mar 2023
# this script analyzes recordings of 14 metal plates in an effort to find the most prevelant harmonics
# each plate was truck on the center, side, and corner - which makes a total of 42 recordings
# the most characteristic harmonics from each type of strike is then added to a list of
# harmonics that decribes each plate, and that data is create an order for the plates


from scipy.io import wavfile
from analyze import calculate_harmonics

import matplotlib, math, csv
import matplotlib.pyplot as plt
import numpy as np

plotting = False
matplotlib.rc('font', size=4)

def analyze_plates(strike, lo, hi, num_peaks):
    fig, axs = plt.subplots(7, 2, sharex=True, sharey=True)

    title = "the top " + str(num_peaks) + " harmonics when struck on the " + str(strike)
    fig.suptitle(title)
    fig.tight_layout()
    fig.subplots_adjust(top=0.95)

    harmonics = []

    for idx in range(1, 15):

        filename = './../audio/' + str(idx) + '-' + strike + '.wav'
        fs, x = wavfile.read(filename)
        X, props = calculate_harmonics(fs, x, num_peaks, lo, hi)

        freq_bin = props['freq_bin']

        x = (np.arange(0, X.size, 1) * freq_bin)[lo:]
        y = X[lo:]

        row = (idx - 1) // 2
        col = (idx - 1) % 2
        axs[row, col].set_ylim([0.4, 1.1])
        axs[row, col].set_xlim([lo, hi])
        axs[row, col].plot(x, y)

        x = props['peaks'] * freq_bin
        y = X[props['peaks']]

        axs[row, col].plot(x, y, 'ro', markersize=1)
        for hz, mag in zip(x, y):
             axs[row, col].annotate('%.2f' % hz,
                                    xy=(hz,mag),
                                    xytext=(hz+10,mag),
                                    horizontalalignment='left',
                                    verticalalignment='center')

        sorted_harmonics = np.sort(props['peaks']) * freq_bin
        harmonics.append(sorted_harmonics)

    if plotting:
        plt.savefig(strike + '.png', dpi=1200, bbox_inches='tight')
        plt.close()

    return np.array(harmonics)

center_harmonics = analyze_plates('center', 300, 2000, 2)
corner_harmonics = analyze_plates('corner', 300, 1250, 3)
side_edge_harmonics = analyze_plates('side-edge', 450, 1250, 3)

all_harmonics = np.concatenate((corner_harmonics[:,0:1],
                                side_edge_harmonics[:,0:1],
                                center_harmonics[:,0:1],
                                corner_harmonics[:,2:3],
                                center_harmonics[:,1:2],
                                ), axis=1)

def find_commas(harmonics):


with open('harmonics.csv', 'w', encoding='UTF8') as f:
    writer = csv.writer(f)
    writer.writerows(all_harmonics)
