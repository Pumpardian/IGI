import inputModule
import task1
import task2
import task3
import task4
import task5

def menu():
    '''
    Function to display menu with executable options to select.

    Args: None

    Returns: None
    '''

    while True:
        print("MENU:")
        print("1) Task1")
        print("2) Task2")
        print("3) Task3")
        print("4) Task4")
        print("5) Task5")
        print("0) Exit")

        choice = inputModule.user_input("Enter task number: ", int, 0, 5)

        if choice == 1:
            task1.execute()
        elif choice == 2:
            task2.execute()
        elif choice == 3:
            task3.execute()
        elif choice == 4:
            task4.execute()
        elif choice == 5:
            task5.execute()
        elif choice == 0:
            print("Finishing execution...")
            break