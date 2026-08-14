#include <iostream>
#include <random>
using namespace std;

int main() {
    random_device rd;
    mt19937 generator(rd());
    uniform_int_distribution<int> randomNumber(1, 10);

    int secretNumber = randomNumber(generator);
    int guess = -1;
    int hint;
    int guess2;

    while (guess != 0) {
        cout << "Think How to Escape the Infinity Loop!!!" << endl << " : ";
        cout << "=== GUESS THE NUMBER ===\n";
        cout << "Guess a number from 1 to 10: ";

        cin >> guess;

        // Hidden escape mechanic: entering 0 reveals the current random number.
        if (guess == 0) {
            cout << endl << "You escaped the infinity loop!" << endl;
            cout << "The random number was " << secretNumber << "." << endl;
            break;
        }

        hint = guess + secretNumber;
        cout << endl << " My first output : " << hint;
        cout << endl << " : ";

        cout << "Guess now!" << endl << " : ";
        cin >> guess2;

        if (guess2 == secretNumber) {
            cout << "You win!\n";
        }
        else {
            cout << "You lose. The number was "
                 << secretNumber << ".\n";
        }

        secretNumber = randomNumber(generator);
    }

    return 0;
}
