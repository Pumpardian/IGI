import re
import zipfile

class TextAnalyzer:
    """
    A class for analyzing text files.

    Args:
    - source_file (str): The path to the source file.
    - result_file (str): The path to the result file.

    Attributes:
    - source_file (str): The path to the source file.
    - result_file (str): The path to the result file.
    - zip_file (str): The name of the zip file.

    Methods:
    - analyze(): Analyzes the text from the source file.
    - save(): Saves the analysis results to the result file.
    - archive(): Archives the result file.
    - get_info(): Retrieves information about the file in the archive.
    """

    def __init__(self, source_file, result_file):
        self.source_file = source_file
        self.result_file = result_file
        self.zip_file = 'result.zip'

    def analyze(self):
        """
        Analyzes the text from the source file.

        Reads the text from the source file and finds the required information, such as sentences,
        declarative sentences, interrogative sentences, imperative sentences, words, emoticons and
        other things from individual task

        Args:
        - None.

        Returns:
        - None.
        """

        with open(self.source_file, 'r') as f:
            text = f.read()

        self.sentences = re.findall(r'[\.!?]', text)
        self.countsentences = re.split(r'[\.!?]', text)
        self.declarative_sentences = [s for s in self.sentences if re.search(r'\.', s)]
        self.interrogative_sentences = [s for s in self.sentences if re.search(r'\?', s)]
        self.imperative_sentences = [s for s in self.sentences if re.search(r'\!', s)]
        self.words = re.findall(r'\b\w+\b', text)
        self.emoticons = re.findall(r'[:;]-*[()\[\]]+', text)
        self.list_uppercase = re.findall(r'[A-Z]', text)
        self.abc = re.sub(r'[a]{1,}[b]{2,}[c]{1,}', 'qqq', text, flags=re.IGNORECASE)
        largest_word_len = len(max(self.words, key=len))

        self.max_len_count = 0
        for word in self.words:
            if len(word) == largest_word_len:
                self.max_len_count += 1

        self.words_with_dot_or_comma_on_end = re.findall(r'\b\w+[\,.]', text)
        words_ending_with_e = [word for word in self.words if word.endswith('e')]
        self.largest_word_ending_with_e = max(words_ending_with_e, key=len)

    def save(self):
        """
        Saves the analysis results to the result file.

        Writes the analysis results, such as the number of sentences, declarative sentences,
        interrogative sentences, imperative sentences, average sentence length, average word length,
        and number of emoticons, to the result file.

        Args: None

        Returns: None
        """

        with open(self.result_file, 'w') as f:
            f.write(f'Number of sentences: {len(self.countsentences) - 1}\n')
            f.write(f'Number of declarative sentences: {len(self.declarative_sentences)}\n')
            f.write(f'Number of interrogative sentences: {len(self.interrogative_sentences)}\n')
            f.write(f'Number of imperative sentences: {len(self.imperative_sentences)}\n')
            f.write(f'Average sentence length: {sum(len(s) for s in self.countsentences) / len(self.countsentences)}\n')
            f.write(f'Average word length: {sum(len(w) for w in self.words) / len(self.words)}\n')
            f.write(f'Number of emoticons: {len(self.emoticons)}\n')
            
            f.write(f'Uppercase english letters: {self.list_uppercase}\n')
            f.write(f'a...ab...bc...c pattern replacement: {self.abc}\n')
            f.write(f'Number of words with max length: {self.max_len_count}\n')
            f.write(f'Words with dot or comma on end: {self.words_with_dot_or_comma_on_end}\n')
            f.write(f'Largest word that ends on e: {self.largest_word_ending_with_e}\n')

    def archive(self):
        """
        Archives the result file.

        Archives the result file into a zip file.

        Args: None.

        Returns: None.
        """

        with zipfile.ZipFile(self.zip_file, 'w') as zipf:
            zipf.write(self.result_file)

    def get_info(self):
        """
        Retrieves information about the file in the archive.

        Retrieves information about the file in the archive, such as the compressed file size
        and the uncompressed file size.

        Args: None

        Returns: None
        """

        with zipfile.ZipFile(self.zip_file, 'r') as zipf:
            info = zipf.getinfo(self.result_file)
            print(f'Compressed file size: {info.compress_size} bytes')
            print(f'Uncompressed file size: {info.file_size} bytes')

def execute():
    """
    Analyzes the source file and save the result and its archived copy using TextAnalyzer class

    Args: None

    Returns: None
    """
    analyzer = TextAnalyzer('source.txt', 'result.txt')
    analyzer.analyze()

    analyzer.save()
    analyzer.archive()
    analyzer.get_info()
