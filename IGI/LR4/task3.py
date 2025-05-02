import inputModule
import math
import numpy as np
from tabulate import tabulate
from statistics import median, mode, variance, stdev
import matplotlib.pyplot as plt

class SequenceAnalyzer:
    """
    A class for analyzing sequences.

    Args:
    - sequence (list): Sequence to analyze.

    Attributes:
    - sequence (list): Sequence to analyze.

    Methods:
    - calculate_mean(): Calculates the mean of the sequence.
    - calculate_median(): Calculates the median of the sequence.
    - calculate_mode(): Calculates the mode of the sequence.
    - calculate_variance(): Calculates the variance of the sequence.
    - calculate_standard_deviation(): Calculates the standard deviation of the sequence.
    """
    def __init__(self, sequence):
        self.sequence = sequence

    def calculate_mean(self):
        """
        Calculates sequence mean.

        Args:
        - None.

        Returns:
        - (float): Sequence mean.
        """
        return sum(self.sequence) / len(self.sequence)

    def calculate_median(self):
        """
        Calculates sequence median.

        Args:
        - None.

        Returns:
        - (float): Sequence median.
        """
        return median(self.sequence)

    def calculate_mode(self):
        """
        Calculates sequence mode.

        Args:
        - None.

        Returns:
        - (float): Sequence mode.
        """
        return mode(self.sequence)

    def calculate_variance(self):
        """
        Calculates sequence variance.

        Args:
        - None.

        Returns:
        - (float): Sequence variance.
        """
        return variance(self.sequence)

    def calculate_standard_deviation(self):
        """
        Calculates sequence standard deviation.

        Args:
        - None.

        Returns:
        - (float): Sequence standard deviation.
        """
        return stdev(self.sequence)

def calculate_actual_value(x):
    """
    Calculates the actual value based on a given input 'x'.

    Args:
    - None.

    Returns:
    - (float): Actual value of x.
    """
    math_tmp = (x+1) / (x-1)
    return math.log(math_tmp)

class SequenceCalculator(SequenceAnalyzer):
    """
    A class for analyzing sequences.

    Args:
    - max_iterations (int): max number of iterations.
    - eps (float): epsilon value.

    Attributes:
    - sequence (list): Sequence to analyze.
    - max_iterations (int): max number of iterations.
    - eps (float): epsilon value.

    Methods:
    - calculate_mean(): Calculates the mean of the sequence.
    - calculate_median(): Calculates the median of the sequence.
    - calculate_mode(): Calculates the mode of the sequence.
    - calculate_variance(): Calculates the variance of the sequence.
    - calculate_standard_deviation(): Calculates the standard deviation of the sequence.
    - calculate_sequence(x): Calculates sequence.
    - generate_table(x, result, actual_value): Generates a table with calculation results.
    """
    def __init__(self, max_iterations, eps):
        super().__init__([])
        self.max_iterations = max_iterations
        self.eps = eps

    def calculate_sequence(self, x):
        """
        Calculates sequence.

        Args:
        - None.

        Returns:
        - result (float): Calculation result.
        """
        result = 0
        n = 1
        tmp = 2 / x

        while abs(tmp) > self.eps and n <= self.max_iterations:
            result += tmp
            tmp /= x*x * (2*n + 1) / (2*n - 1)
            n += 1
            self.sequence.append(result)
        return result

    def generate_table(self, x, result, actual_value):
        """
        Generates a table with calculation results.

        Args:
        - x (float): x value.
        - result (float): result value.
        - actual_value (float): actual value.

        Returns:
        - table (str): convenient table for analyzing.
        """
        table_data = [[x, len(self.sequence), result, actual_value, self.eps]]
        table_headers = ["x", "n", "F(x)", "Math F(x)", "eps"]
        table = tabulate(table_data, headers=table_headers, floatfmt=".8f")
        return table
    
def execute():
    '''
    Function that computes natural logarithm approximation using SequenceCalculator class.

    The function prompts the user for input (x and epsilon values).
    Then calculates the results and displays them in format of a table.

    Args: None.

    Returns: None.
    '''

    max_iterations = 500

    x = inputModule.user_input("Enter x: ", float, -1, 1, True)
    eps = inputModule.user_input("Enter eps: ", float, 0.00000001, 0.00001)

    calculator = SequenceCalculator(max_iterations, eps)
    result = calculator.calculate_sequence(x)
    actual_value = calculate_actual_value(x)
    table = calculator.generate_table(x, result, actual_value)

    print(table)
    print("Arithmetic Mean:", calculator.calculate_mean())
    print("Median:", calculator.calculate_median())
    print("Mode:", calculator.calculate_mode())
    print("Variance:", calculator.calculate_variance())
    print("Standard Deviation:", calculator.calculate_standard_deviation())

    x_values = np.linspace(0, 1, len(calculator.sequence))
    y_values = calculator.sequence

    plt.plot(x_values, y_values, color="blue", label="Series")
    plt.plot(x_values, [calculate_actual_value(x)] * len(calculator.sequence), color="red",
             linestyle="--", label="Math F(x)")
    plt.xlabel('n')
    plt.ylabel('F(x)')
    plt.legend()
    plt.grid(True)
    plt.title("Plot of decomposion into a series")

    plt.savefig("Task3.png")

    plt.show()