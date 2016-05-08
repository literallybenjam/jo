//
//  BJMNSOverworld.m
//  Jō
//
//  Created by BJMNS on 8/23/13.
//  Copyright (c) 2013 BJMNS. All rights reserved.
//

#import "BJMNSOverworld.h"

@implementation BJMNSOverworld

- (id)initWithFrame:(NSRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
    }
    
    return self;
}
- (void)awakeFromNib
{
    _currentMapIndex = 0x1D;
}
- (void)prepareOpenGL
{
    GLint swapInt = 1;
    [[self openGLContext] setValues:&swapInt forParameter:NSOpenGLCPSwapInterval];
    
    CVDisplayLinkCreateWithActiveCGDisplays(&_displayLink);
    CVDisplayLinkSetOutputCallback(_displayLink, &displayLinkCallback, (__bridge void *)(self));
    CGLContextObj cglContext = [[self openGLContext] CGLContextObj];
    CGLPixelFormatObj cglPixelFormat = [[self pixelFormat] CGLPixelFormatObj];
    CVDisplayLinkSetCurrentCGDisplayFromOpenGLContext(_displayLink, cglContext, cglPixelFormat);
    CVDisplayLinkStart(_displayLink);
    
    glClearColor(0, 0, 0, 0);
    
    glEnable(GL_TEXTURE_2D);
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
}

static CVReturn displayLinkCallback(CVDisplayLinkRef displayLink, const CVTimeStamp *now, const CVTimeStamp *outputTime, CVOptionFlags flagsIn, CVOptionFlags *flagsOut, void *displayLinkContext)
{
    return [(__bridge BJMNSOverworld *)displayLinkContext drawCurrentMap];
}

- (void)drawSprite:(const unsigned char *)sprite atX:(unsigned char)x andY:(unsigned char)y andZ:(unsigned char)z
{
    unsigned char data[16][16][4];
    for (char j = 0; j < 16; j++) {
        for (char i = 0; i < 16; i++) {
            data[15-j][i][0] = BJMNSColor[sprite[j*16+i]][0];
            data[15-j][i][1] = BJMNSColor[sprite[j*16+i]][1];
            data[15-j][i][2] = BJMNSColor[sprite[j*16+i]][2];
            if (sprite[j*16+i]) data[15-j][i][3] = 0xFF;
            else data[15-j][i][3] = 0x00;
        }
    }
    float xx = x/8.0 - 1;
    float yy = y/5.0 - 1;
    float zz = z/2.0 - 1;
    GLuint texID;
    glGenTextures(1, &texID);
    glBindTexture(GL_TEXTURE_2D, texID);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glColor4ub(255, 255, 255, 255);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, 16, 16, 0, GL_RGBA, GL_UNSIGNED_BYTE, data);
    glBegin(GL_QUADS);
    glTexCoord2f(0, 0); glVertex3f(xx, yy, zz);
    glTexCoord2f(1, 0); glVertex3f(xx+1/8.0, yy, zz);
    glTexCoord2f(1, 1); glVertex3f(xx+1/8.0, yy+1/5.0, zz);
    glTexCoord2f(0, 1); glVertex3f(xx, yy+1/5.0, zz);
    glEnd();
}
- (CVReturn)drawCurrentMap
{
    [[self openGLContext] makeCurrentContext];
    for (unsigned char i = 0; i < 160; i++) {
        [self drawSprite:BJMNSTileTexture[BJMNSTileMap[_currentMapIndex][i]] atX:i%16 andY:9-i/16 andZ:0];
        // Draw Enemies
        // Draw Characters
        if (BJMNSStructureMap[_currentMapIndex][i])
            [self drawSprite:BJMNSStructureTexture[BJMNSStructureMap[_currentMapIndex][i]] atX:i%16 andY:9-i/16 andZ:3];
        // Draw Particles
    }
    return kCVReturnSuccess;
}

- (void)drawRect:(NSRect)bounds;
{
    glClear(GL_COLOR_BUFFER_BIT);
    [self drawCurrentMap];
    glFlush();
}
 
 @end
 
