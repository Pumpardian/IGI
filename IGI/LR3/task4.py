import time

def timeDecorator(func):
    '''
    Decorator function to measure the execution time of a function.

    Args:
    - func (function): The function to be decorated.

    Returns:
    - wrapper (function): The wrapper function.
    '''

    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print("Execution time:", end_time - start_time, "seconds")
        return result
    return wrapper

@timeDecorator
def execute():
    '''
    This function counts the number of words in a text, identifies the largest word and its number and outputs even words.
    It also measures the execution time of the function.

    Args: None

    Returns: None
    '''
    
    text = ("So she was considering in her own mind, as well as she could, for the hot day made her feel very sleepy "
            "and stupid, whether the pleasure of making a daisy-chain would be worth the trouble of getting up and"
            " picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.")
    
    words = text.replace(',', '').split()
    largest_word = max(words, key=len, default=None)
    largest_word_index = list.index(words, largest_word)

    print(f"Words count: {len(words)}")
    print(f"Largest word: {largest_word} ; and its number is: {largest_word_index + 1}")
    print("Even words:", ", ".join(words[1::2]))
