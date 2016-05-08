/*  MAIN PROJECT IMPLEMENTATION | main.cc  */

#include "JO_ns/JO_ns.h"

//  MAIN PROGARAM  //

int main() {
    JO::Game game;
    game.run();
    return game.errors();
}
