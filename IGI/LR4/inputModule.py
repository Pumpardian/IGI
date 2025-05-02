def user_input(msg, data_type, min_value = None, max_value = None, exclusive_mode = False):
    '''
    Requests user to input value with desired min and max amount.
    
    Args:
    - msg (str): Message to display for user.
    - data_type (type): Expected data type for input (int, float, str).
    - min_value (int/float, OPTIONAL): Minimum value allowed (inclusive). Def: None.
    - max_value (int/float, OPTIONAL): Maximum value allowed (inclusive). Def: None.
    - exclusive_mode (bool, OPTIONAL): Whether to exclude range [min_value; max_value]. Def: False.
    
    Returns:
    - userInput (int/float/str): Validated user input.

    Raises:
    - ValueError: In case of invalid type or range.
    '''

    while True:
        try:
            userInput = data_type(input(msg))

            if exclusive_mode:
                if min_value is not None and userInput >= min_value and max_value is not None and userInput <= max_value:
                    raise ValueError(f"Value must not be in range [{min_value}; {max_value}].")
            else:
                if min_value is not None and userInput < min_value:
                    raise ValueError(f"Value must be >= {min_value}")
                if max_value is not None and userInput > max_value:
                    raise ValueError(f"Value must be <= {max_value}")
            
            return userInput
        except ValueError as err:
            print(f"Error: {err}. Please try again.")