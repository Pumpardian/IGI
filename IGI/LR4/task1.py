import csv
import pickle
import inputModule

class Product:
    """
    A class for analyzing text files.

    Args:
    - name (str): The product name.
    - batch_size (int): The product batch size.

    Attributes:
    - name (str): The product name.
    - batch_size (int): The product batch size.

    Methods:
    - None.
    """
        
    def __init__(self, name, batch_size):
        self._name = name
        self._batch_size = int(batch_size)

    @property
    def name(self):
        return self._name
    
    @name.setter
    def name(self, value):
        self._name = int(value)

    @property
    def batch_size(self):
        return self._batch_size
    
    @batch_size.setter
    def batch_size(self, value):
        self._batch_size = value

class ExportProduct(Product):
    """
    A class that represents the export product, implements the Product class.

    Args:
    - name (str): The product name.
    - import_country (str): The product import country.
    - batch_size (int): The product batch size.

    Attributes:
    - name (str): The product name.
    - import_country (str): The product import country.
    - batch_size (int): The product batch size.

    Methods:
    - get_info(): Retrieves information about the product.
    - sort_by_name(products), static: Sorts the list of products by name.
    """

    def __init__(self, name, import_country, batch_size):
        super().__init__(name, batch_size)
        self._import_country = import_country

    @property
    def import_country(self):
        return self._import_country
    
    @import_country.setter
    def import_country(self, value):
        self.import_country = value

    def get_info(self):
        """
        Retrieves information about product by printing its properties.

        Args:
        - None.

        Returns:
        - None.
        """
        print("Name: ", self.name)
        print("Country: ", self.import_country)
        print("Batch size: ", self.batch_size)
        print("----------------------")

    @staticmethod
    def sort_by_name(products):
        """
        Sorts specified list of products by name.

        Args:
        - products (list): list of products to sort.

        Returns:
        - None.
        """
        products.sort(key=lambda x: x.name)

def save_to_csv(products):
    """
    Saves specified list of products to csv file.

    Args:
    - products (list): list of products to save.

    Returns:
    - None.
    """
    with open("products.csv", mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["Name", "Import Country", "Batch Size"])
        for product in products:
            writer.writerow([product.name, product.import_country, product.batch_size])
    print("Data has been saved to products.csv")


def load_from_csv():
    """
    Loads list of products from csv file.

    Args:
    - None.

    Returns:
    - None.
    """
    product_list = []
    with open("products.csv", mode="r") as file:
        reader = csv.reader(file)
        next(reader)
        for row in reader:
            product = ExportProduct(row[0], row[1], row[2])
            product_list.append(product)
    return product_list


def save_to_pickle(products):
    """
    Saves specified list of products to pickle file.

    Args:
    - products (list): list of products to save.

    Returns:
    - None.
    """
    with open("products.pickle", mode="wb") as file:
        pickle.dump(products, file)
    print("Data has been saved to products.pickle")


def load_from_pickle():
    """
    Loads list of products from pickle file.

    Args:
    - None.

    Returns:
    - None.
    """
    with open("products.pickle", mode="rb") as file:
        product_list = pickle.load(file)
    return product_list


def execute():
    """
    Provides user a possibility to manage export products list by adding, sorting,
    saving, loading and getting information about its elements.

    Args: None.

    Returns: None.
    """
    product_list = []

    while True:
        print("\nMenu")
        print("1) Add export product")
        print("2) Print product list")
        print("3) Sort product list")
        print("4) Print import countries by product name")
        print("5) Save data to CSV")
        print("6) Load data from CSV")
        print("7) Save data to pickle")
        print("8) Load data from pickle")
        print("0) Exit")

        choice = inputModule.user_input("Choose menu option: ", int, 0, 8)

        if choice == 1:
            export_product_data = {"name": inputModule.user_input("Enter product name: ", str),
                                   "country": inputModule.user_input("Enter import country: ", str),
                                   "batch_size": inputModule.user_input("Enter batch size: ", int, 1)}
        
            export_product = ExportProduct(export_product_data["name"], export_product_data["country"], export_product_data["batch_size"])
            export_product.get_info()

            product_list.append(export_product)
            print("Product has been successfully added")

        elif choice == 2:
            print("Product list:")
            for product in product_list:
                ExportProduct.get_info(product)
        
        elif choice == 3:
            ExportProduct.sort_by_name(product_list)
            print("Product list has been sorted")

        elif choice == 4:
            total_batch = 0
            name = inputModule.user_input("Enter product name: ", str)
            print("Countries that import that product:")
            for product in product_list:
                if product.name == name:
                    print(product.import_country)
                    total_batch += product.batch_size
            print(F"With total batch size: {total_batch}")

        elif choice == 5:
            save_to_csv(product_list)

        elif choice == 6:
            product_list = load_from_csv()

        elif choice == 7:
            save_to_pickle(product_list)

        elif choice == 8:
            product_list = load_from_csv()

        elif choice == 0:
            print("Task completed execution, exiting...")
            break