import numpy as np
import inputModule


class Matrix:
    """
    A basic matrix class.

    Args:
    - rows (int): Rows count.
    - columns (int): Columns count.

    Attributes:
    - rows (int): Rows count.
    - columns (int): Columns count.

    Methods:
    - fill_random(): Fill the matrix with random integers between -100 and 100.
    - display(): Display the matrix.
    """
    def __init__(self, rows, columns):
        self.rows = rows
        self.columns = columns
        self.data = np.empty((rows, columns))

    def fill_random(self):
        '''
        Fill the matrix with random integers between -100 and 100.

        Args: None.

        Returns: None.
        '''
        self.data = np.random.randint(-100, 100, size=(self.rows, self.columns))

    def display(self):
        '''
        Display the matrix.

        Args: None.

        Returns: None.
        '''
        print(self.data)


class IntegerMatrix(Matrix):
    """
    An integer matrix class based on matrix class.

    Args:
    - rows (int): Rows count.
    - columns (int): Columns count.

    Attributes:
    - rows (int): Rows count.
    - columns (int): Columns count.

    Methods:
    - fill_random(): Fill the matrix with random integers between -100 and 100.
    - display(): Display the matrix.
    - find_min_elements_column(): Find column with minimum sum of elements.
    - math_median(column): Calculate the median of the matrix column using numpy.
    - custom_median(column): Calculate the median of the matrix column using the formula.
    """
    def __init__(self, rows, columns):
        super().__init__(rows, columns)
        self.data = np.empty((rows, columns), dtype=int)

    def find_min_elements_column(self):
        '''
        Find column with minimum sum of elements.

        Args: None.

        Returns: min_sum_column_index (int): Index of column with min sum.
        '''
        min_sum_column_index = 0
        min_sum_column_value = 999999999999
        for i in range(self.columns):
            print(f"row {i}: sum - {self.data[:,i].sum()}")
            if self.data[:,i].sum() < min_sum_column_value:
                min_sum_column_value = sum(self.data[:,i])
                min_sum_column_index = i
        return min_sum_column_index

    def math_median(self, column):
        '''
        Calculate the median of the matrix column using numpy.

        Args: column (int): Column index.

        Returns: median (float): The median of specified column.
        '''
        median = np.median(self.data[:,column])
        return median

    def custom_median(self, column):
        '''
        Calculate the median of the matrix column using the formula.

        Args: column (int): Column index.

        Returns: median (float): The median of specified column.
        '''
        row = self.data[:,column]
        sorted_row = sorted(row)
        if (len(sorted_row) % 2 == 1):
            median = sorted_row[(len(sorted_row)-1)/2]
        else:
            median = (sorted_row[(len(sorted_row)-1)//2] + sorted_row[(len(sorted_row)-1)//2 + 1]) / 2
        return median


def execute():
    '''
    Function that generates matrix using IntegerMatrix class and provides operations to interact with it.

    Args: None.

    Returns: None.
    '''
    m = inputModule.user_input("Enter matrix column count: ", int, 1, 10000)
    n = inputModule.user_input("Enter matrix row count: ", int, 1, 10000)

    integer_matrix = IntegerMatrix(m, n)
    integer_matrix.fill_random()
    print("Initial Matrix:")
    integer_matrix.display()
    min = integer_matrix.find_min_elements_column()
    print()
    print("Column with min sum:")
    print(integer_matrix.data[:,min])
    print()
    print("Median of min column with numpy:")
    print(integer_matrix.math_median(min))
    print()
    print("Median of min column with formula:")
    print(integer_matrix.custom_median(min))