//
//  BJMNSGameWindow.m
//  Jō
//
//  Created by BJMNS on 8/25/13.
//  Copyright (c) 2013 BJMNS. All rights reserved.
//

#import "BJMNSGameWindow.h"

@implementation BJMNSGameWindow

- (void) awakeFromNib {
    _k[BJMNSKEY_UP] = false;
    _k[BJMNSKEY_RIGHT] = false;
    _k[BJMNSKEY_DOWN] = false;
    _k[BJMNSKEY_LEFT] = false;
    _k[BJMNSKEY_X] = false;
    _k[BJMNSKEY_Z] = false;
    _k[BJMNSKEY_S] = false;
    _k[BJMNSKEY_A] = false;
    _k[BJMNSKEY_W] = false;
    _k[BJMNSKEY_Q] = false;
}

- (BOOL *)k {
    return _k;
}

- (void)keyDown:(NSEvent *)theEvent {
    if ([theEvent keyCode] == BJMNSK_UP) _k[BJMNSKEY_UP] = true;
    if ([theEvent keyCode] == BJMNSK_RIGHT) _k[BJMNSKEY_RIGHT] = true;
    if ([theEvent keyCode] == BJMNSK_DOWN) _k[BJMNSKEY_DOWN] = true;
    if ([theEvent keyCode] == BJMNSK_LEFT) _k[BJMNSKEY_LEFT] = true;
    if ([theEvent keyCode] == BJMNSK_X) _k[BJMNSKEY_X] = true;
    if ([theEvent keyCode] == BJMNSK_Z) _k[BJMNSKEY_Z] = true;
    if ([theEvent keyCode] == BJMNSK_S) _k[BJMNSKEY_S] = true;
    if ([theEvent keyCode] == BJMNSK_A) _k[BJMNSKEY_A] = true;
    if ([theEvent keyCode] == BJMNSK_W) _k[BJMNSKEY_W] = true;
    if ([theEvent keyCode] == BJMNSK_Q) _k[BJMNSKEY_Q] = true;
}
- (void)keyUp:(NSEvent *)theEvent {
    if ([theEvent keyCode] == BJMNSK_UP) _k[BJMNSKEY_UP] = false;
    if ([theEvent keyCode] == BJMNSK_RIGHT) _k[BJMNSKEY_RIGHT] = false;
    if ([theEvent keyCode] == BJMNSK_DOWN) _k[BJMNSKEY_DOWN] = false;
    if ([theEvent keyCode] == BJMNSK_LEFT) _k[BJMNSKEY_LEFT] = false;
    if ([theEvent keyCode] == BJMNSK_X) _k[BJMNSKEY_X] = false;
    if ([theEvent keyCode] == BJMNSK_Z) _k[BJMNSKEY_Z] = false;
    if ([theEvent keyCode] == BJMNSK_S) _k[BJMNSKEY_S] = false;
    if ([theEvent keyCode] == BJMNSK_A) _k[BJMNSKEY_A] = false;
    if ([theEvent keyCode] == BJMNSK_W) _k[BJMNSKEY_W] = false;
    if ([theEvent keyCode] == BJMNSK_Q) _k[BJMNSKEY_Q] = false;
}

@end
