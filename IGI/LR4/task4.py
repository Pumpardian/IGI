import math
from abc import ABC, abstractmethod
from matplotlib import pyplot as plt
import inputModule


class GeometricFigure(ABC):
    """
    A base class for geometric figures.

    Args:
    - None.

    Attributes:
    - None.

    Methods:
    - calculate_area(): Abstract method to calculate the area of a geometric figure.
    """
    @abstractmethod
    def calculate_area(self):
        '''
        Abstract method to calculate the area of a geometric figure.

        Args: None.

        Returns: None.
        '''
        ...


class FigureColor:
    """
    A base class for figure colors.

    Args:
    - color (str): Figure color.

    Attributes:
    - color (str): Figure color.

    Methods:
    - None.
    """
    def __init__(self, color):
        self.color = color

    @property
    def color(self):
        return self._color

    @color.setter
    def color(self, value):
        self._color = value


class IsoscelesTriangle(GeometricFigure):
    """
    Isosceles triangle class based on GemetricFigure class.

    Args:
    - color (str): Figure color.
    - base (float): Triangle base.
    - height (float): Triangle height.

    Attributes:
    - color (str): Figure color.
    - base (float): Triangle base.
    - height (float): Triangle height.

    Methods:
    - calculate_area(): Calculate the area of the triangle.
    - draw(): Draw the triangle using matplotlib.
    - __str__(): String representation of the triangle.
    """
    _figure_name = "Isosceles Triangle"

    def __init__(self, color, base, height):
        self.color = FigureColor(color)
        self.base = base
        self.height = height

    @property
    def figure_name(self):
        return self._figure_name

    @figure_name.setter
    def figure_name(self, value):
        self._figure_name = value

    def calculate_area(self):
        '''
        Calculate the area of the triangle.

        Args: None.

        Returns: (float): Triangle area.
        '''
        return self.base * self.height / 2

    def draw(self):
        '''
        Draw the triangle using matplotlib.

        Args: None.

        Returns: None.
        '''
        b = self.base
        h = self.height
        x = [-b/2, b/2, 0]
        y = [-h/2, -h/2, h/2]
        if self.color.color == "red":
            plt.fill(x, y, "red")
        elif self.color.color == "green":
            plt.fill(x, y, "green")
        elif self.color.color == "blue":
            plt.fill(x, y, "blue")
        elif self.color.color == "black":
            plt.fill(x, y, "black")
        elif self.color.color == "yellow":
            plt.fill(x, y, "yellow")
        plt.axis("equal")
        plt.xlim(min(x) - 10, max(x) + 10)
        plt.ylim(min(y) - 10, max(y) + 10)
        plt.text(0, -h - 1.5, self.figure_name, ha="center")
        plt.savefig("figure.png")

        plt.show()

    def __str__(self):
        '''
        String representation of the triangle.

        Args: None.

        Returns: (str): triangle info.
        '''
        return "{} with base {} units, heigh: {} units, color: {}, square: {:.2f} sq.units.".format(
            self.figure_name, self.base, self.height, self.color.color, self.calculate_area()
        )


def execute():
    '''
    Function that draws the figure with specified parameters by user, using IsoscelesTriangle class.

    Args: None.

    Returns: None.
    '''
    name = inputModule.user_input("Enter figure name: ", str)
    base = inputModule.user_input("Enter figure base: ", float, 0.1)
    height = inputModule.user_input("Enter figure height: ", float, 0.1)
    allowed_colors = ["red", "green", "blue", "black", "yellow"]
    color = inputModule.user_input("Enter figure color (red, green, blue, black, yellow): ", str)
    while color.lower() not in allowed_colors:
        print("Invalid color! Retry.")
        color = inputModule.user_input("Enter figure color (red, green, blue, black, yellow): ", str)
    triangle = IsoscelesTriangle(color, base, height)
    triangle.figure_name = name
    print(triangle)
    triangle.draw()