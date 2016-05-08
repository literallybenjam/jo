/*  JO NAMESPACE DEFINITION | JO_ns.h  */

#include "JO_ns.h"

//  PALETTE  //

const Uint32 JO::PALETTE[16] = {
    0x00000000,
    0x000000FF,
    0x4F4F4FFF,
    0x777777FF,
    0xFFFFFFFF,
    0x87372FFF,
    0x47979FFF,
    0x8B3F97FF,
    0x076323FF,
    0x579F47FF,
    0x002B57FF,
    0x174B77FF,
    0xCBC35FFF,
    0xAB7349FF,
    0x574300FF,
    0x7F1F39FF
};

//  GAME LOGIC  //

Uint32 JO::Game::logic(Uint32 interval, void * parameter) {

    JO::Game * game = static_cast<JO::Game *>(parameter);

    if (game -> errors()) game -> quit();
    if (game -> isRunning()) return interval;
    else return 0;

}

//  CLASS CONSTRUCTORS  //

JO::Game::Game() : Application(JO::Game::logic, this), area(0x1D) {
}

//  CLASS DESTRUCTORS  //

JO::Game::~Game() {
    delete tiles;
    delete structures;
    delete particles;
    delete characters;
}

//  GAME INITIALIZATION  //

void JO::Game::init() {

    //  Initial variable setup
    char filename[1024];

    //  Loads resources
    PS::getResourceLocation("Tiles", "Textures", filename, 1024);
    tiles = new TEXTURE::Sprite_Container(window -> renderer, filename, JO::PALETTE);

    PS::getResourceLocation("Structures", "Textures", filename, 1024);
    structures = new TEXTURE::Sprite_Container(window -> renderer, filename, JO::PALETTE);

    particles = NULL;
    characters = NULL;

    PS::getResourceLocation("Tile_Map", "Maps", filename, 1024);
    tile_map = new GRIDMAP::Map(filename);

    PS::getResourceLocation("Structure_Map", "Maps", filename, 1024);
    structure_map = new GRIDMAP::Map(filename);

    //  Sets up SDL
    SDL_SetWindowTitle(window -> frame, "J\u014d: The Game");
    SDL_SetHint(SDL_HINT_RENDER_SCALE_QUALITY, "nearest");

    window -> viewport_width = 256;
    window -> viewport_height = 160;
    window -> viewport_unit = 16;
    SDL_SetWindowSize(window -> frame, 512, 320);
    SDL_SetWindowPosition(window -> frame, SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED);

    OBJECT_2D::Global::init(window -> renderer, NULL);
    PS::getResourceLocation("Tiles", "Textures", filename, 1024);
    test_object = new OBJECT_2D::GenericObject(filename, JO::PALETTE, false, false, 8, 8, 16, 16);

}

//  DRAW FUNCTION  //

void JO::Game::draw() {
    int unit = window -> viewport_scale * window -> viewport_unit;

    //  Creates a unit rectangle
    SDL_Rect unit_rect;
    unit_rect.w = unit;
    unit_rect.h = unit;

    //  Draws tiles and structures
    for (unsigned char i = 0; i < 160; i++) {
        unit_rect.x = (i % 0x10) * unit;
        unit_rect.y = (i / 0x10) * unit;
        SDL_RenderCopy(window -> renderer, (* tiles)[(* tile_map)(area, i)], NULL, &unit_rect);
        SDL_RenderCopy(window -> renderer, (* structures)[(* structure_map)(area, i)], NULL, &unit_rect);
    }

    //  Draws 2D objects
    OBJECT_2D::Global::drawObjects(window -> viewport_scale);

}
