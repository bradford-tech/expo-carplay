// CPSCompat.m
// Runtime workaround for an iOS 26.4 / 26.5 CarPlaySupport.framework bug:
// -[CPSMapTemplateViewController _updateShareButtonVisibility] sends
// -vehicleSupportsDestinationSharing to its `destinationSharingDelegate`
// (a private CPSTemplateInstance) *without* checking respondsToSelector:.
// CPSTemplateInstance does not implement the selector in 26.4/26.5 builds,
// so every CPMapTemplate push crashes in viewDidLoad with doesNotRecognizeSelector:.
//
// We install a default implementation returning NO at load time. class_addMethod
// is a no-op once Apple ships the missing impl, so this is self-deactivating.

#import <Foundation/Foundation.h>
#import <objc/runtime.h>

@interface ExpoCarPlayCPSCompat : NSObject
@end

@implementation ExpoCarPlayCPSCompat

+ (void)load {
    Class cls = NSClassFromString(@"CPSTemplateInstance");
    if (!cls) return;

    SEL sel = sel_registerName("vehicleSupportsDestinationSharing");
    if (class_respondsToSelector(cls, sel)) return;

    IMP imp = imp_implementationWithBlock(^BOOL(__unused id _self) { return NO; });
    class_addMethod(cls, sel, imp, "B@:");
}

@end
