//
//  BJMNSOverworld.h
//  Jō
//
//  Created by BJMNS on 8/23/13.
//  Copyright (c) 2013 BJMNS. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import <OpenGL/gl.h>
#include "BJMNSSprites.h"
#include "BJMNSMaps.h"

@interface BJMNSOverworld : NSOpenGLView
{
    CVDisplayLinkRef _displayLink;
}

@property unsigned char currentMapIndex;

- (void)drawSprite:(const unsigned char *)sprite atX:(unsigned char)x andY:(unsigned char)y andZ:(unsigned char)z;
- (CVReturn)drawCurrentMap;
- (void)drawRect:(NSRect)bounds;

@end
