//
//  BJMNSAppDelegate.m
//  Jō
//
//  Created by BJMNS on 8/22/13.
//  Copyright (c) 2013 BJMNS. All rights reserved.
//

#import "BJMNSAppDelegate.h"

@implementation BJMNSAppDelegate

- (id)init
{
    self = [super init];
    
    if (self) {
        _timer = [NSTimer scheduledTimerWithTimeInterval:.03 target:self selector:@selector(runLogicOnTimer:) userInfo:nil repeats:YES];
    }
    
    return self;
}

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification
{
    [self.window setContentAspectRatio:NSMakeSize(16, 10)];
}

- (void)runLogicOnTimer:(NSTimer *)timer
{
    if (self.window.k[BJMNSKEY_LEFT])
        self.overworld.currentMapIndex -= 0x10;
    if (self.window.k[BJMNSKEY_RIGHT])
        self.overworld.currentMapIndex += 0x10;
    if (self.window.k[BJMNSKEY_UP])
        self.overworld.currentMapIndex--;
    if (self.window.k[BJMNSKEY_DOWN])
        self.overworld.currentMapIndex++;
}

@end
