/*  JO NAMESPACE DECLARATION | JO_ns.h  */

#ifndef U2764_JO_NS_H
#define U2764_JO_NS_H

#include "/Users/bjmns/u2764/Works/Libraries/C/PS_ns/PS_ns.h"
#include "/Users/bjmns/u2764/Works/Libraries/C/SDL_ns/SDL_ns.h"
#include "/Users/bjmns/u2764/Works/Libraries/C/TEXTURE_ns/TEXTURE_Sprite_Container_c.h"
#include "/Users/bjmns/u2764/Works/Libraries/C/GRIDMAP_ns/GRIDMAP_ns.h"
#include "/Users/bjmns/u2764/Works/Libraries/C/OBJECT_2D_ns/OBJECT_2D_ns.h"

namespace JO {
    extern const Uint32 PALETTE[16];

    enum Colour {
        TRANSPARENT,
        BLACK,
        DARK_GREY,
        GREY,
        WHITE,
        RED,
        CYAN,
        PURPLE,
        FOREST_GREEN,
        GREEN,
        DEEP_BLUE,
        BLUE,
        YELLOW,
        ORANGE,
        BROWN,
        ROSE
    };
    enum Tile {
        //  [0x] Plains
        EMPTY,
        GRASS,
        PLAINS_TILE_2,
        PLAINS_TILE_3,
        PLAINS_TILE_4,
        PLAINS_TILE_5,
        PLAINS_TILE_6,
        PLAINS_TILE_7,
        PLAINS_TILE_8,
        PLAINS_TILE_9,
        PLAINS_TILE_A,
        PLAINS_TILE_B,
        PLAINS_TILE_C,
        PLAINS_TILE_D,
        PLAINS_TILE_E,
        PLAINS_TILE_F,
        //  [1x] Shore
        SHORE_LEFT,
        SHORE_RIGHT,
        SHORE_TOP,
        SHORE_BOTTOM,
        SHORE_TOP_LEFT,
        SHORE_TOP_RIGHT,
        SHORE_BOTTOM_LEFT,
        SHORE_BOTTOM_RIGHT,
        SHORE_LEFT_TOP,
        SHORE_RIGHT_TOP,
        SHORE_LEFT_BOTTOM,
        SHORE_RIGHT_BOTTOM,
        SHORE_LEFT_TOP_RIGHT,
        SHORE_TOP_RIGHT_BOTTOM,
        SHORE_RIGHT_BOTTOM_LEFT,
        SHORE_BOTTOM_LEFT_TOP,
        //  [2x] Water
        WATER,
        BRIDGE_MIDDLE,
        BRIDGE_LEFT,
        BRIDGE_RIGHT,
        BRIDGE_TOP,
        BRIDGE_BOTTOM,
        WATER_TILE_6,
        WATER_TILE_7,
        WATER_TILE_8,
        WATER_TILE_9,
        WATER_TILE_A,
        WATER_TILE_B,
        WATER_TILE_C,
        WATER_TILE_D,
        WATER_TILE_E,
        WATER_TILE_F,
        //  [3x] Path
        PATH_HORIZONTAL,
        PATH_VERTICAL,
        PATH_TOP_LEFT,
        PATH_TOP_RIGHT,
        PATH_BOTTOM_LEFT,
        PATH_BOTTOM_RIGHT,
        PATH_INTERSECTION,
        PATH_LEFT_TOP_RIGHT,
        PATH_TOP_RIGHT_BOTTOM,
        PATH_RIGHT_BOTTOM_LEFT,
        PATH_BOTTOM_LEFT_TOP,
        PATH_LEFT,
        PATH_RIGHT,
        PATH_TOP,
        PATH_BOTTOM,
        PATH_TILE_F,
        //  [4x] Cobble
        COBBLE_MIDDLE,
        COBBLE_LEFT,
        COBBLE_RIGHT,
        COBBLE_TOP,
        COBBLE_BOTTOM,
        COBBLE_TOP_LEFT,
        COBBLE_TOP_RIGHT,
        COBBLE_BOTTOM_LEFT,
        COBBLE_BOTTOM_RIGHT,
        COBBLE_LEFT_TOP,
        COBBLE_RIGHT_TOP,
        COBBLE_LEFT_BOTTOM,
        COBBLE_RIGHT_BOTTOM,
        COBBLE_TILE_D,
        COBBLE_TILE_E,
        COBBLE_TILE_F,
        //  [5x] House
        FLOOR,
        BED_TOP,
        BED_BOTTOM,
        TABLE_BOTTOM_LEFT,
        TABLE_BOTTOM,
        TABLE_BOTTOM_RIGHT,
        TABLE_BOTTOM_DRAWER,
        HOUSE_TILE_7,
        HOUSE_TILE_8,
        HOUSE_TILE_9,
        HOUSE_TILE_A,
        HOUSE_TILE_B,
        HOUSE_TILE_C,
        HOUSE_TILE_D,
        HOUSE_TILE_E,
        HOUSE_TILE_F
    };
    enum Structure {
        //  [0x] Plains
        NONE,
        TREE_TOP_LEFT,
        TREE_TOP_RIGHT,
        TREE_BOTTOM_LEFT,
        TREE_BOTTOM_RIGHT,
        FENCE_INTERSECTION,
        FENCE_HORIZONTAL,
        FENCE_VERTICAL,
        FENCE_LEFT,
        FENCE_RIGHT,
        FENCE_TOP,
        FENCE_BOTTOM,
        FOUNTAIN,
        FLOWERS,
        PLAINS_STRUCTURE_E,
        PLAINS_STRUCTURE_F,
        //  [1x] Water
        WATERFALL,
        BRIDGE_BORDER_HORIZONTAL,
        BRIDGE_BORDER_VERTICAL,
        BRIDGE_BORDER_LEFT,
        BRIDGE_BORDER_RIGHT,
        BRIDGE_BORDER_TOP,
        BRIDGE_BORDER_BOTTOM,
        WATER_STRUCTURE_7,
        WATER_STRUCTURE_8,
        WATER_STRUCTURE_9,
        WATER_STRUCTURE_A,
        WATER_STRUCTURE_B,
        WATER_STRUCTURE_C,
        WATER_STRUCTURE_D,
        WATER_STRUCTURE_E,
        WATER_STRUCTURE_F,
        //  [2x] House (Common)
        HOUSE_TOP,
        HOUSE_MIDDLE,
        HOUSE_BOTTOM_LEFT,
        HOUSE_BOTTOM,
        HOUSE_WINDOW,
        HOUSE_DOOR_CLOSED,
        HOUSE_BOTTOM_RIGHT,
        HOUSE_DOOR_OPEN,
        WALL_TOP_LEFT,
        WALL_TOP_RIGHT,
        WALL_BOTTOM_LEFT,
        WALL_BOTTOM_RIGHT,
        WALL_HORIZONTAL,
        WALL_LEFT,
        WALL_RIGHT,
        HOUSE_COMMON_STRUCTURE_F,
        //  [3x] House (Specific)
        HOUSE_HORIZONTAL_TOP_LEFT,
        HOUSE_HORIZONTAL_TOP_RIGHT,
        HOUSE_HORIZONTAL_LEFT,
        HOUSE_HORIZONTAL_RIGHT,
        HOUSE_VERTICAL_TOP_LEFT,
        HOUSE_VERTICAL_TOP_RIGHT,
        HOUSE_VERTICAL_UPPER_LEFT,
        HOUSE_VERTICAL_UPPER,
        HOUSE_VERTICAL_UPPER_RIGHT,
        HOUSE_VERTICAL_LOWER_LEFT,
        HOUSE_VERTICAL_LOWER_RIGHT,
        HOUSE_SPECIFIC_STRUCTURE_B,
        HOUSE_SPECIFIC_STRUCTURE_C,
        HOUSE_SPECIFIC_STRUCTURE_D,
        HOUSE_SPECIFIC_STRUCTURE_E,
        HOUSE_SPECIFIC_STRUCTURE_F,
        //  [4x] House (Wall Extras)
        WALL_HORIZONTAL_SMALL_WINDOW,
        WALL_HORIZONTAL_WINDOW_LEFT,
        WALL_HORIZONTAL_WINDOW_RIGHT,
        WALL_HORIZONTAL_OPENING_LEFT,
        WALL_HORIZONTAL_OPENING_RIGHT,
        WALL_LEFT_SMALL_WINDOW,
        WALL_LEFT_WINDOW_TOP,
        WALL_LEFT_WINDOW_BOTTOM,
        WALL_LEFT_OPENING_TOP,
        WALL_LEFT_OPENING_BOTTOM,
        WALL_RIGHT_SMALL_WINDOW,
        WALL_RIGHT_WINDOW_TOP,
        WALL_RIGHT_WINDOW_BOTTOM,
        WALL_RIGHT_OPENING_TOP,
        WALL_RIGHT_OPENING_BOTTOM,
        HOUSE_WALL_EXTRAS_F,
        //  [5x] House (Furniture)
        BED_FOOT,
        HOUSE_FURNITURE_2,
        HOUSE_FURNITURE_3,
        HOUSE_FURNITURE_4,
        HOUSE_FURNITURE_5,
        HOUSE_FURNITURE_6,
        HOUSE_FURNITURE_7,
        HOUSE_FURNITURE_8,
        HOUSE_FURNITURE_9,
        HOUSE_FURNITURE_A,
        HOUSE_FURNITURE_B,
        HOUSE_FURNITURE_C,
        HOUSE_FURNITURE_D,
        HOUSE_FURNITURE_E,
        HOUSE_FURNITURE_F,
        //  [6x] House (Table)
        TABLE_TOP_LEFT,
        TABLE_TOP,
        TABLE_TOP_RIGHT,
        TABLE_MIDDLE_LEFT,
        TABLE_MIDDLE,
        TABLE_MIDDLE_RIGHT,
        TABLE_TOP_CANDLE,
        TABLE_MIDDLE_BOOK,
        TABLE_MIDDLE_PAPER,
        HOUSE_TABLE_9,
        HOUSE_TABLE_A,
        HOUSE_TABLE_B,
        HOUSE_TABLE_C,
        HOUSE_TABLE_D,
        HOUSE_TABLE_E,
        HOUSE_TABLE_F
    };

    class Game;

}

class JO::Game : public SDL::Application {

private:

    unsigned char area;

    TEXTURE::Sprite_Container * tiles;
    TEXTURE::Sprite_Container * structures;
    TEXTURE::Sprite_Container * particles;
    TEXTURE::Sprite_Container * characters;

    GRIDMAP::Map * tile_map;
    GRIDMAP::Map * structure_map;

    OBJECT_2D::GenericObject * test_object;

    void init();
    static Uint32 logic(Uint32 interval, void * parameter);
    void draw();

public:
    Game();
    ~Game();

};

#endif
