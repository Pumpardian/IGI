import inputModule

def my_generator():
    '''
    Generator function for input

    Args: None

    Returns: Generator object
    '''
    value = 1
    while value != 0:
        value = inputModule.user_input("Enter an integer (0 to end): ", int)
        yield value


def execute():
    '''
    Function that calculates the sum out of entered numbers squares

    Args: None

    Returns: None
    '''

    sum = 0
    
    for value in my_generator():
        sum += value * value
    
    print(f"Sum: {sum}")