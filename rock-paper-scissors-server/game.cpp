#include <iostream>
#include <random>
using namespace std;

void showRock() {
    cout << R"(
        _______
    ---'   ____)
          (_____)
          (_____)
          (____)
    ---.__(___)
    )";
}

void showPaper() {
    cout << R"(
         _______
    ---'    ____)____
               ______)
              _______)
             _______)
    ---.__________)
    )";
}

void showScissors() {
    cout << R"(
        _______
    ---'   ____)____
              ______)
           __________)
          (____)
    ---.__(___)
    )";
}

void showHand(int x) {
    if (x == 1) showRock();
    else if (x == 2) showPaper();
    else if (x == 3) showScissors();
}

int main() {
    random_device rd;
    mt19937 generator(rd());
    uniform_int_distribution<int> computerChoice(1, 3);

    int player = -1;

    while (player != 0) {
        int computer = computerChoice(generator);

        cout << "\n: === ROCK PAPER SCISSORS ===\n";
        cout << ": 1 = Rock\n";
        cout << ": 2 = Paper\n";
        cout << ": 3 = Scissors\n";
        cout << ": 0 = Exit loop\n\n";
        cout << ": Choose: ";

        if (!(cin >> player)) return 0;

        if (player == 0) {
            cout << "\nExiting game...\n";
            break;
        }

        if (player < 1 || player > 3) {
            cout << "\nInvalid choice.\n";
            continue;
        }

        cout << "\nYou chose:\n";
        showHand(player);

        cout << "\n\nComputer chose:\n";
        showHand(computer);
        cout << "\n\n";

        if (player == computer) cout << "Tie!\n";
        else if ((player == 1 && computer == 3) ||
                 (player == 2 && computer == 1) ||
                 (player == 3 && computer == 2)) {
            cout << "You win!\n";
        } else {
            cout << "Computer wins!\n";
        }
    }

    return 0;
}
