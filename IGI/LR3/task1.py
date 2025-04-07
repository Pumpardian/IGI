import math
import inputModule
from tabulate import tabulate

def execute():
    '''
    Function that computes natural logarithm approximation using Taylor series expansion.

    The function prompts the user for input (x and epsilon values).
    Then calculates the results and displays them in format of a table.

    Args: None

    Returns: None
    '''

    max_iterations = 500

    x = inputModule.user_input("Enter x: ", float, -1, 1, True)
    eps = inputModule.user_input("Enter eps: ", float, 0.00000001, 1)

    result = 0
    n = 1
    tmp = 2 / x

    while abs(tmp) > eps and n <= max_iterations:
        result += tmp
        tmp /= x*x * (2*n + 1) / (2*n - 1)
        n += 1
    math_tmp = (x+1) / (x-1)
    math_result = math.log(math_tmp)

    table_data = [ [x, n, result, math_result, eps] ]
    table_names = ["x", "n", "F(x)", "Math F(x)", "eps"]

    table = tabulate(table_data, headers=table_names, floatfmt=".8f")
    print(table)