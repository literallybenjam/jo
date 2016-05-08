//
//  BJMNSGameWindow.h
//  Jō
//
//  Created by BJMNS on 8/25/13.
//  Copyright (c) 2013 BJMNS. All rights reserved.
//

#import <Cocoa/Cocoa.h>

enum BJMNSKey {
    BJMNSKEY_UP,
    BJMNSKEY_RIGHT,
    BJMNSKEY_DOWN,
    BJMNSKEY_LEFT,
    BJMNSKEY_X,
    BJMNSKEY_Z,
    BJMNSKEY_S,
    BJMNSKEY_A,
    BJMNSKEY_W,
    BJMNSKEY_Q,
    BJMNSKEY_LENGTH
};
enum BJMNSK {
    BJMNSK_UP = 0x7E,
    BJMNSK_RIGHT = 0x7C,
    BJMNSK_DOWN = 0x7D,
    BJMNSK_LEFT = 0x7B,
    BJMNSK_X = 0x07,
    BJMNSK_Z = 0x06,
    BJMNSK_S = 0x01,
    BJMNSK_A = 0x00,
    BJMNSK_W = 0x0D,
    BJMNSK_Q = 0x0C
};

@interface BJMNSGameWindow : NSWindow

{
    BOOL _k[BJMNSKEY_LENGTH];
}

@property (readonly) BOOL *k;

@end
