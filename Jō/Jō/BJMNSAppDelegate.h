//
//  BJMNSAppDelegate.h
//  Jō
//
//  Created by BJMNS on 8/22/13.
//  Copyright (c) 2013 BJMNS. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "BJMNSGameWindow.h"
#import "BJMNSOverworld.h"

@interface BJMNSAppDelegate : NSObject <NSApplicationDelegate>

@property (assign) IBOutlet BJMNSGameWindow *window;
@property (weak) IBOutlet BJMNSOverworld *overworld;
@property (weak) NSTimer *timer;

- (void)runLogicOnTimer:(NSTimer *)timer;

@end
