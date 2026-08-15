#include <iostream>
#include <random>
#include <cmath>
#include <vector>
using namespace std;

struct Statistics {
    double meanR = 0.0;
    double meanAbsD = 0.0;
    double meanZ2 = 0.0;
    double meanA = 0.0;
};

Statistics experiment(int N, int repetitions, int exponent, mt19937& generator) {
    uniform_int_distribution<int> coin(0, 1);
    Statistics s;
    for (int trial = 0; trial < repetitions; ++trial) {
        int heads = 0;
        for (int i = 0; i < N; ++i) heads += coin(generator);
        double H = static_cast<double>(heads);
        double R = 2.0 * H / N;
        double D = R - 1.0;
        double Z = sqrt(static_cast<double>(N)) * D;
        double A = pow(R, exponent);
        s.meanR += R;
        s.meanAbsD += abs(D);
        s.meanZ2 += Z * Z;
        s.meanA += A;
    }
    s.meanR /= repetitions;
    s.meanAbsD /= repetitions;
    s.meanZ2 /= repetitions;
    s.meanA /= repetitions;
    return s;
}

int main(int argc, char** argv) {
    int exponent = 2;
    int repetitions = 500;
    if (argc > 1) exponent = stoi(argv[1]);
    if (argc > 2) repetitions = stoi(argv[2]);

    random_device rd;
    mt19937 generator(rd());
    vector<int> sampleSizes = {10, 30, 100, 300, 1000, 3000, 10000};

    cout << "N,meanR,meanAbsD,meanZ2,meanA\n";
    for (int N : sampleSizes) {
        Statistics s = experiment(N, repetitions, exponent, generator);
        cout << N << ',' << s.meanR << ',' << s.meanAbsD << ',' << s.meanZ2 << ',' << s.meanA << '\n';
    }
    return 0;
}
