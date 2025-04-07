import inputModule

def execute():
    '''
    Function to count the number of uppercase letters in a string.

    Args: None

    Returns: None
    '''

    global user_input_res
    user_input_res = inputModule.user_input("Enter a string: ", str)
    uppercase_count = 0

    for char in user_input_res:
        if char.isupper() and char.isascii():
            uppercase_count += 1

    print("Uppercase letters count: ", uppercase_count)