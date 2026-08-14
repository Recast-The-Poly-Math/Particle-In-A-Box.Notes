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
        cout << "Think How to Escape the Infinity Loop!!!" << endl;
        cout << "=== GUESS THE NUMBER ===\n";
        cout << "Guess a number from 1 to 10: ";

        if (!(cin >> guess)) return 0;

        if (guess == 0) {
            cout << "You escaped the infinity loop!\n";
            cout << "The random number was " << secretNumber << ".\n";
            break;
        }

        hint = guess + secretNumber;
        cout << "My first output : " << hint << endl;
        cout << "Guess now!\n";

        if (!(cin >> guess2)) return 0;

        if (guess2 == secretNumber) {
            cout << "You win!\n";
        } else {
            cout << "You lose. The number was " << secretNumber << ".\n";
        }

        secretNumber = randomNumber(generator);
    }

    return 0;
}
