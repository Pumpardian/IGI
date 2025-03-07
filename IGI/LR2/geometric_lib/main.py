import circle
import square
import sys

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Wrong usage, enter an argument")
        sys.exit(1)

    i = float(sys.argv[1])

    print("Square area is ", square.area(i))
    print("Square perimeter is ", square.perimeter(i))

    print("Circle area is", circle.area(i))
    print("Circle perimeter is", circle.perimeter(i))