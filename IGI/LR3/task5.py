import inputModule

def getFloatList():
    '''
    Function to input a list of floating-point numbers.

    Args: None

    Returns:
    - float_list (list): List of floating-point numbers.
    '''
    float_list = []

    while True:
        value = inputModule.user_input("Enter a floating-point number (enter '0' to finish): ", float)
        if value == 0:
            break
        float_list.append(value)
    
    return float_list

def getSumOfNegativeElements(float_list):
    '''
    Calculate sum of negative elements in float list

    Args
    - float_list (list): List of floating-point numbers.

    Returns:
    - sum (float): Results of calculation.
    - None: if list is empty.
    '''
    
    if not float_list:
        return None

    negative_list = [num for num in float_list if num < 0]
    return sum(negative_list)

def getSumBetweenMinMax(float_list):
    '''
    Calculate sum between min and max element in float list

    Args
    - float_list (list): List of floating-point numbers.

    Returns:
    - sum (float): Results of calculation.
    - None: if list is empty.
    '''

    if not float_list:
        return None
    
    min_index = list.index(float_list, min(float_list))
    max_index = list.index(float_list, max(float_list))
    return sum(float_list[min_index + 1 : max_index])

def execute():
    '''
    This function counts proposes the user to input list of floats and then
    outputs it, outputs negative elements, outputs sum between min and max element

    Args: None

    Returns: None
    '''
    
    numbers = getFloatList()

    if not numbers:
        print("Error: The list is empty.")
        return
    
    print(f"The list of numbers is: {numbers}")
    print(f"Sum of negative elements: {getSumOfNegativeElements(numbers)}")
    print(f"Sum of elements between min & max: {getSumBetweenMinMax(numbers)}")