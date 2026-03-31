// Auto-generated from clip.opus.pro/api.opus.pro/api/fancy-template-presets.html
export type OpusCaptionTemplate = {
  templateId: string;
  name: string;
  presetId?: string;
  gifUrl?: string;
  imgUrl?: string;
  videoUrl?: string;
  riveUrl?: string;
  needNewTag?: boolean;
  preferences?: {
    enableCaption?: boolean;
    enableCaptionAnimation?: boolean;
    enableHighlight?: boolean;
    enableUppercase?: boolean;
    captionStyle?: string;
    captionPosition?: string;
    highlightColor?: {
      primary?: string;
      secondary?: string;
    };
    captionAnimation?: {
      name?: string;
      highlightColor?: string;
      bgColor?: string;
    };
    font?: {
      family?: string;
      size?: string;
      numericalSize?: number;
      color?: string;
      stroke?: {
        enabled?: boolean;
        color?: string;
        width?: number;
      };
      style?: string[];
      textDecoration?: string;
      shadow?: {
        enabled?: boolean;
        color?: string;
        x?: number;
        y?: number;
        blur?: number;
      };
    };
  } & Record<string, unknown>;
};

export const OPUS_NONE_TEMPLATE = {
  "templateId": "none",
  "name": "No captions",
  "needNewTag": false,
  "gifUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-None.png",
  "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-None.png",
  "videoUrl": "",
  "preferences": {
    "enableCaption": false,
    "captionStyle": "",
    "captionPosition": "auto",
    "enableCaptionAnimation": false,
    "enableHighlight": false,
    "enableUppercase": false,
    "highlightColor": {
      "primary": "#F5F5F5",
      "secondary": "#F5F5F5"
    },
    "font": {
      "family": "Montserrat",
      "size": "Large",
      "numericalSize": 48,
      "color": "#FFFFFF",
      "stroke": {
        "enabled": false,
        "color": "#000000",
        "width": 0
      },
      "style": [
        "700"
      ],
      "textDecoration": "",
      "shadow": {
        "enabled": false,
        "color": "#000000",
        "x": 0,
        "y": 0,
        "blur": 0
      }
    },
    "captionAnimation": {
      "name": "pop",
      "highlightColor": "#F5F5F5"
    }
  }
} as OpusCaptionTemplate;
export const OPUS_FANCY_TEMPLATES = [
  {
    "presetId": "preset-fancy-Karaoke",
    "templateId": "preset-fancy-Karaoke",
    "name": "Karaoke",
    "gifUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-Karaoke-preview.png",
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-Karaoke.png",
    "videoUrl": "https://public.cdn.opus.pro/clip-web/videos/fancy-template-thumbnails/Karaoke-transcode.mp4",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/karaoke.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": true,
      "captionAnimation": {
        "name": "word-level_karaoke_fill-pop",
        "highlightColor": "#F5F5F5"
      },
      "captionStyle": "",
      "captionPosition": "auto",
      "enableHighlight": true,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": true,
      "highlightColor": {
        "primary": "#F5F5F5",
        "secondary": "#D4D4D4"
      },
      "font": {
        "size": "Large",
        "numericalSize": 40,
        "color": "#ffffff",
        "stroke": {
          "enabled": true,
          "color": "#000000",
          "width": 8
        },
        "style": [
          "900"
        ],
        "textDecoration": "",
        "family": "Montserrat",
        "shadow": {
          "enabled": true,
          "color": "#000000",
          "x": 2,
          "y": 2,
          "blur": 2
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-Gameplay",
    "templateId": "preset-fancy-Gameplay",
    "name": "Gameplay",
    "gifUrl": "",
    "imgUrl": "",
    "videoUrl": "https://public.cdn.opus.pro/clip-web/videos/fancy-template-thumbnails/Gameplay-transcode.mp4",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "enableGameLayout": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": true,
      "captionAnimation": {
        "name": "pop",
        "highlightColor": "#F5F5F5"
      },
      "captionStyle": "one-line",
      "captionPosition": "auto",
      "enableHighlight": true,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": true,
      "highlightColor": {
        "primary": "#F5F5F5",
        "secondary": "#D4D4D4"
      },
      "font": {
        "size": "Large",
        "numericalSize": 50,
        "color": "#ffffff",
        "stroke": {
          "enabled": true,
          "color": "#000000FF",
          "width": 16
        },
        "style": [
          "900"
        ],
        "textDecoration": "",
        "family": "Komika-axis",
        "shadow": {
          "enabled": true,
          "color": "#FFFFFFFF",
          "x": 2,
          "y": 2,
          "blur": 16,
          "useWordHighlightColor": false
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-Beasty",
    "templateId": "preset-fancy-Beasty",
    "name": "Beasty",
    "gifUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-Beasty-preview.png",
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-Beasty.png",
    "videoUrl": "https://public.cdn.opus.pro/clip-web/videos/fancy-template-thumbnails/Beasty-transcode.mp4",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/beasty.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": true,
      "captionAnimation": {
        "name": "pop",
        "highlightColor": "#F5F5F5"
      },
      "captionStyle": "one-line",
      "captionPosition": "auto",
      "enableHighlight": true,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": true,
      "highlightColor": {
        "primary": "#F5F5F5",
        "secondary": "#D4D4D4"
      },
      "font": {
        "size": "Large",
        "numericalSize": 50,
        "color": "#ffffff",
        "stroke": {
          "enabled": true,
          "color": "#000000FF",
          "width": 16
        },
        "style": [
          "900"
        ],
        "textDecoration": "",
        "family": "Komika-axis",
        "shadow": {
          "enabled": true,
          "color": "#FFFFFFFF",
          "x": 2,
          "y": 2,
          "blur": 16,
          "useWordHighlightColor": false
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-Deep_Diver",
    "templateId": "preset-fancy-Deep_Diver",
    "name": "DeepDiver",
    "gifUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-Deep_Diver-preview.png",
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-Deep_Diver.png",
    "videoUrl": "https://public.cdn.opus.pro/clip-web/videos/fancy-template-thumbnails/Deep-Diver-transcode.mp4",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/deep_diver.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": true,
      "captionAnimation": {
        "name": "deep-diver",
        "highlightColor": "#000000",
        "bgColor": "#E4E4E4"
      },
      "captionStyle": "one-line",
      "captionPosition": "auto",
      "enableHighlight": false,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": false,
      "highlightColor": {
        "primary": "#F5F5F5",
        "secondary": "#D4D4D4"
      },
      "font": {
        "size": "Large",
        "numericalSize": 50,
        "color": "#C6C6C6",
        "stroke": {
          "enabled": true,
          "color": "#000000",
          "width": 0
        },
        "style": [
          "700"
        ],
        "textDecoration": "",
        "family": "Poppins",
        "shadow": {
          "enabled": true,
          "color": "#000000",
          "x": 0,
          "y": 0,
          "blur": 0
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 30,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-Youshaei",
    "templateId": "preset-fancy-Youshaei",
    "name": "Youshaei",
    "gifUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-Youshaei-preview.png",
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-Youshaei.png",
    "videoUrl": "https://public.cdn.opus.pro/clip-web/videos/fancy-template-thumbnails/Youshaei3-transcode.mp4",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/youshaei.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": true,
      "captionAnimation": {
        "name": "deep-diver",
        "highlightColor": "#E5E5E5",
        "bgColor": "#00000000"
      },
      "captionStyle": "one-line",
      "captionPosition": "middle",
      "enableHighlight": false,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": true,
      "highlightColor": {
        "primary": "#F5F5F5",
        "secondary": "#D4D4D4"
      },
      "font": {
        "size": "Large",
        "numericalSize": 60,
        "color": "#A1A1A1FF",
        "stroke": {
          "enabled": false,
          "color": "#000000",
          "width": 6
        },
        "style": [
          "900"
        ],
        "textDecoration": "",
        "family": "Roboto",
        "shadow": {
          "enabled": true,
          "color": "#000000FF",
          "x": 2,
          "y": 2,
          "blur": 1,
          "useWordHighlightColor": false
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-Pod_P",
    "templateId": "preset-fancy-Pod_P",
    "name": "PodP",
    "gifUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-Pod_P-preview.png",
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-Pod_P.png",
    "videoUrl": "https://public.cdn.opus.pro/clip-web/videos/fancy-template-thumbnails/Pod-P-transcode.mp4",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/pod_p.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": false,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": false,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": false,
      "captionAnimation": {
        "name": "word-level_karaoke_fill-pop",
        "highlightColor": "#F5F5F5"
      },
      "captionStyle": "one-line",
      "captionPosition": "auto",
      "enableHighlight": false,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": true,
      "highlightColor": {
        "primary": "#E5E5E5",
        "secondary": "#D4D4D4"
      },
      "font": {
        "size": "Large",
        "numericalSize": 85,
        "color": "#D4D4D4",
        "stroke": {
          "enabled": true,
          "color": "#000000",
          "width": 8
        },
        "style": [
          "500"
        ],
        "textDecoration": "",
        "family": "BerninaSans",
        "shadow": {
          "enabled": true,
          "color": "#000000",
          "x": 1,
          "y": 1,
          "blur": 4
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-Mozi",
    "templateId": "preset-fancy-Mozi",
    "name": "Mozi",
    "gifUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-Mozi-preview.png",
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-Mozi.png",
    "videoUrl": "https://public.cdn.opus.pro/clip-web/videos/fancy-template-thumbnails/Mozi-transcode.mp4",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/mozi.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": false,
      "captionAnimation": {
        "name": "scale",
        "highlightColor": "#F5F5F5"
      },
      "captionStyle": "",
      "captionPosition": "auto",
      "enableHighlight": true,
      "enableEmoji": true,
      "emojiStyle": null,
      "enableUppercase": true,
      "highlightColor": {
        "primary": "#F5F5F5",
        "secondary": "#D4D4D4"
      },
      "font": {
        "size": "Large",
        "numericalSize": 50,
        "color": "#ffffff",
        "stroke": {
          "enabled": true,
          "color": "#000000",
          "width": 10
        },
        "style": [
          "900"
        ],
        "textDecoration": "",
        "family": "Montserrat",
        "shadow": {
          "enabled": true,
          "color": "#000000",
          "x": 2,
          "y": 2,
          "blur": 4
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-Popline",
    "templateId": "preset-fancy-Popline",
    "name": "Popline",
    "gifUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-Popline-preview.png",
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-Popline.png",
    "videoUrl": "https://public.cdn.opus.pro/clip-web/videos/fancy-template-thumbnails/Popline-transcode.mp4",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/popline.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": true,
      "captionAnimation": {
        "name": "word-level_karaoke_bg-highlight",
        "highlightColor": "#CFCFCF"
      },
      "captionStyle": "one-line",
      "captionPosition": "auto",
      "enableHighlight": true,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": true,
      "highlightColor": {
        "primary": "#E5E5E5",
        "secondary": "#CFCFCF"
      },
      "font": {
        "size": "Large",
        "numericalSize": 40,
        "color": "#ffffff",
        "stroke": {
          "enabled": true,
          "color": "#000000",
          "width": 8
        },
        "style": [
          "900"
        ],
        "textDecoration": "",
        "family": "SplineSans",
        "shadow": {
          "enabled": true,
          "color": "#000000",
          "x": 2,
          "y": 2,
          "blur": 2
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-Simple",
    "templateId": "preset-fancy-Simple",
    "name": "Simple",
    "gifUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-Simple-preview.png",
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-Simple.png",
    "videoUrl": "https://public.cdn.opus.pro/clip-web/videos/fancy-template-thumbnails/Simple-transcode.mp4",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/simple.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": false,
      "captionAnimation": {
        "name": "word-level_karaoke_fill-pop",
        "highlightColor": "#F5F5F5"
      },
      "captionStyle": "one-line",
      "captionPosition": "auto",
      "enableHighlight": false,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": true,
      "highlightColor": {
        "primary": "#F5F5F5",
        "secondary": "#D4D4D4"
      },
      "font": {
        "size": "Large",
        "numericalSize": 80,
        "color": "#ffffff",
        "stroke": {
          "enabled": true,
          "color": "#000000",
          "width": 10
        },
        "style": [
          "400"
        ],
        "textDecoration": "",
        "family": "BebasNeue",
        "shadow": {
          "enabled": false,
          "color": "#000000",
          "x": 2,
          "y": 2,
          "blur": 5
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-Think_Media",
    "templateId": "preset-fancy-Think_Media",
    "name": "ThinkMedia",
    "gifUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-Think_Media-preview.png",
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/preset-fancy-Think_Media.png",
    "videoUrl": "https://public.cdn.opus.pro/clip-web/videos/fancy-template-thumbnails/Think-Media-transcode.mp4",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/think_media.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": true,
      "captionAnimation": {
        "name": "pop",
        "highlightColor": "#F5F5F5"
      },
      "captionStyle": "",
      "captionPosition": "auto",
      "enableHighlight": true,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": true,
      "highlightColor": {
        "primary": "#F5F5F5",
        "secondary": "#D4D4D4"
      },
      "font": {
        "size": "Large",
        "numericalSize": 55,
        "color": "#ffffff",
        "stroke": {
          "enabled": true,
          "color": "#000000",
          "width": 6
        },
        "style": [
          "600",
          "italic"
        ],
        "textDecoration": "",
        "family": "Oswald",
        "shadow": {
          "enabled": true,
          "color": "#000000",
          "x": 4,
          "y": 2,
          "blur": 1
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-Glitch-infinite-zoom",
    "templateId": "preset-fancy-Glitch-infinite-zoom",
    "name": "GlitchInfinite",
    "needNewTag": true,
    "gifUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/glitch-infinite-zoom-preview.png",
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/glitch-infinite-zoom.png",
    "videoUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/glitch-infinite-zoom-v2.mp4",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/glitch_infinite.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": true,
      "captionAnimation": {
        "name": "glitch-infinite-zoom",
        "highlightColor": ""
      },
      "captionStyle": "",
      "captionPosition": "auto",
      "enableHighlight": false,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": false,
      "highlightColor": {
        "primary": "#F5F5F5",
        "secondary": "#D4D4D4"
      },
      "font": {
        "size": "Large",
        "numericalSize": 48,
        "color": "#F5F5F5",
        "stroke": {
          "enabled": false,
          "color": "#000000",
          "width": 6
        },
        "style": [
          "600"
        ],
        "textDecoration": "",
        "family": "Poppins",
        "shadow": {
          "enabled": true,
          "color": "#111111",
          "x": 6,
          "y": 6,
          "blur": 0
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-Seamless-bounce",
    "templateId": "preset-fancy-Seamless-bounce",
    "name": "SeamlessBounce",
    "needNewTag": true,
    "gifUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/seamless-bounce-preview.png",
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/seamless-bounce.png",
    "videoUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/seamless-bounce-v2.mp4",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/seamless_bounce.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": true,
      "captionAnimation": {
        "name": "seamless-bounce",
        "highlightColor": "#D4D4D4"
      },
      "captionStyle": "",
      "captionPosition": "auto",
      "enableHighlight": false,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": false,
      "highlightColor": {
        "primary": "#F5F5F5",
        "secondary": "#D4D4D4"
      },
      "font": {
        "size": "Large",
        "numericalSize": 40,
        "color": "#FFFFFF",
        "stroke": {
          "enabled": true,
          "color": "#3A3A3A",
          "width": 20
        },
        "style": [
          "600"
        ],
        "textDecoration": "",
        "family": "Poppins",
        "shadow": {
          "enabled": false,
          "color": "#111111",
          "x": 4,
          "y": 4,
          "blur": 0
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-Baby-earthquake",
    "templateId": "preset-fancy-Baby-earthquake",
    "name": "BabyEarthquake",
    "needNewTag": true,
    "gifUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/baby-earthquake-preview.png",
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/baby-earthquake.png",
    "videoUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/baby-earthquake-v2.mp4",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/baby_earthquake.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": true,
      "captionAnimation": {
        "name": "baby-earthquake",
        "highlightColor": "#D4D4D4"
      },
      "captionStyle": "",
      "captionPosition": "auto",
      "enableHighlight": false,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": false,
      "highlightColor": {
        "primary": "#F5F5F5",
        "secondary": "#D4D4D4"
      },
      "font": {
        "size": "medium",
        "numericalSize": 48,
        "color": "#FFFFFF",
        "stroke": {
          "enabled": false,
          "color": "#3A3A3A",
          "width": 30
        },
        "style": [
          "600"
        ],
        "textDecoration": "",
        "family": "Optima",
        "shadow": {
          "enabled": true,
          "color": "#0000001A",
          "x": 4,
          "y": 4,
          "blur": 8
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-Blur-switch",
    "templateId": "preset-fancy-Blur-switch",
    "name": "BlurSwitch",
    "needNewTag": true,
    "gifUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/blur-switch-preview.png",
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/blur-switch.png",
    "videoUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/blur-switch-v2.mp4",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/blur_switch.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": true,
      "captionAnimation": {
        "name": "blur-switch",
        "highlightColor": "#D4D4D4"
      },
      "captionStyle": "",
      "captionPosition": "auto",
      "enableHighlight": false,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": true,
      "highlightColor": {
        "primary": "#F5F5F5",
        "secondary": "#D4D4D4"
      },
      "font": {
        "size": "Large",
        "numericalSize": 48,
        "color": "#FFFFFF",
        "stroke": {
          "enabled": false,
          "color": "#3A3A3A",
          "width": 30
        },
        "style": [
          "600"
        ],
        "textDecoration": "",
        "family": "Roboto",
        "shadow": {
          "enabled": false,
          "color": "#111111",
          "x": 4,
          "y": 4,
          "blur": 0
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-Highlighter-box-around",
    "templateId": "preset-fancy-Highlighter-box-around",
    "name": "HighlighterBox",
    "needNewTag": true,
    "gifUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/word-level_simple_bg-highlight-preview.png",
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/word-level_simple_bg-highlight.png",
    "videoUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/word-level_simple_bg-highlight-v2.mp4",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/highlighter_box.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": true,
      "captionAnimation": {
        "name": "word-level_simple_bg-highlight",
        "highlightColor": "#D4D4D4",
        "bgColor": "#1F1F1F"
      },
      "captionStyle": "",
      "captionPosition": "auto",
      "enableHighlight": false,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": false,
      "highlightColor": {
        "primary": "#F5F5F5",
        "secondary": "#D4D4D4"
      },
      "font": {
        "size": "Large",
        "numericalSize": 48,
        "color": "#FFFFFF",
        "stroke": {
          "enabled": true,
          "color": "#1F1F1F",
          "width": 15
        },
        "style": [
          "600"
        ],
        "textDecoration": "",
        "family": "Anton",
        "shadow": {
          "enabled": false,
          "color": "#111111",
          "x": 4,
          "y": 4,
          "blur": 0
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-individual-focus",
    "templateId": "preset-fancy-individual-focus",
    "name": "Focus",
    "needNewTag": true,
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/individual-focus.png",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/focus.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": true,
      "captionAnimation": {
        "name": "individual-focus",
        "highlightColor": "#D4D4D4",
        "bgColor": "#1F1F1F"
      },
      "captionStyle": "",
      "captionPosition": "auto",
      "enableHighlight": true,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": true,
      "highlightColor": {
        "primary": "#D4D4D4",
        "secondary": "#D4D4D4"
      },
      "font": {
        "size": "Large",
        "numericalSize": 43,
        "color": "#FFFFFF",
        "stroke": {
          "enabled": true,
          "color": "#000000",
          "width": 10
        },
        "style": [
          "700"
        ],
        "textDecoration": "",
        "family": "Thabit",
        "shadow": {
          "enabled": true,
          "color": "#000000",
          "x": 1,
          "y": 1,
          "blur": 0
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-blur-in",
    "templateId": "preset-fancy-blur-in",
    "name": "BlurIn",
    "needNewTag": true,
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/blur-in.png",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/blur_in.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": true,
      "captionAnimation": {
        "name": "blur-in",
        "highlightColor": "#D4D4D4",
        "bgColor": "#1F1F1F"
      },
      "captionStyle": "",
      "captionPosition": "auto",
      "enableHighlight": true,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": false,
      "highlightColor": {
        "primary": "#D4D4D4",
        "secondary": "#D4D4D4"
      },
      "font": {
        "size": "Large",
        "numericalSize": 46,
        "color": "#FFFFFF",
        "stroke": {
          "enabled": true,
          "color": "#000000",
          "width": 10
        },
        "style": [
          "400"
        ],
        "textDecoration": "",
        "family": "PoltawskiNowy",
        "shadow": {
          "enabled": true,
          "color": "#000000",
          "x": 1,
          "y": 1,
          "blur": 0
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-simple-words-pop",
    "templateId": "preset-fancy-simple-words-pop",
    "name": "WithBackdrop",
    "needNewTag": true,
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/simple-words-pop.png",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/with_backdrop.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": true,
      "captionAnimation": {
        "name": "simple-words-pop",
        "highlightColor": "#FFFFFF",
        "bgColor": "#1F1F1F"
      },
      "captionStyle": "",
      "captionPosition": "auto",
      "enableHighlight": true,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": false,
      "highlightColor": {
        "primary": "#FFFFFF",
        "secondary": "#FFFFFF"
      },
      "font": {
        "size": "Large",
        "numericalSize": 40,
        "color": "#D4D4D4",
        "stroke": {
          "enabled": false,
          "color": "#000000",
          "width": 0
        },
        "style": [
          "400"
        ],
        "textDecoration": "",
        "family": "Lemon",
        "shadow": {
          "enabled": true,
          "color": "#000000",
          "x": 1,
          "y": 1,
          "blur": 0
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-slide-in-from-top",
    "templateId": "preset-fancy-slide-in-from-top",
    "name": "SoftLanding",
    "needNewTag": true,
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/slide-in-from-top.png",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/soft_landing.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": true,
      "captionAnimation": {
        "name": "slide-in-from-top",
        "highlightColor": "#D4D4D4",
        "bgColor": "#1F1F1F"
      },
      "captionStyle": "",
      "captionPosition": "auto",
      "enableHighlight": true,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": false,
      "highlightColor": {
        "primary": "#D4D4D4",
        "secondary": "#D4D4D4"
      },
      "font": {
        "size": "Large",
        "numericalSize": 44,
        "color": "#FFFFFF",
        "stroke": {
          "enabled": false,
          "color": "#000000",
          "width": 0
        },
        "style": [
          "700"
        ],
        "textDecoration": "",
        "family": "Archivo",
        "shadow": {
          "enabled": true,
          "color": "#000000",
          "x": 1,
          "y": 1,
          "blur": 0
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-hover",
    "templateId": "preset-fancy-hover",
    "name": "BabySteps",
    "needNewTag": true,
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/hover.png",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/baby_steps.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": true,
      "captionAnimation": {
        "name": "hover",
        "highlightColor": "#D4D4D4",
        "bgColor": "#1F1F1F"
      },
      "captionStyle": "",
      "captionPosition": "auto",
      "enableHighlight": false,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": true,
      "highlightColor": {
        "primary": "#D4D4D4",
        "secondary": "#D4D4D4"
      },
      "font": {
        "size": "Large",
        "numericalSize": 42,
        "color": "#FFFFFF",
        "stroke": {
          "enabled": true,
          "color": "#D4D4D4",
          "width": 10
        },
        "style": [
          "700"
        ],
        "textDecoration": "",
        "family": "Heebo",
        "shadow": {
          "enabled": true,
          "color": "#000000",
          "x": 0,
          "y": 4,
          "blur": 4
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-scale-in",
    "templateId": "preset-fancy-scale-in",
    "name": "Grow",
    "needNewTag": true,
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/scale-in.png",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/grow.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": true,
      "captionAnimation": {
        "name": "scale-in",
        "highlightColor": "#D4D4D4",
        "bgColor": "#1F1F1F"
      },
      "captionStyle": "",
      "captionPosition": "auto",
      "enableHighlight": true,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": true,
      "highlightColor": {
        "primary": "#D4D4D4",
        "secondary": "#D4D4D4"
      },
      "font": {
        "size": "Large",
        "numericalSize": 46,
        "color": "#FFFFFF",
        "stroke": {
          "enabled": true,
          "color": "#BDBDBD",
          "width": 10
        },
        "style": [
          "700"
        ],
        "textDecoration": "",
        "family": "Kanit",
        "shadow": {
          "enabled": true,
          "color": "#BDBDBD",
          "x": 3,
          "y": 3,
          "blur": 10
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  },
  {
    "presetId": "preset-fancy-breathe-scale-wiggle",
    "templateId": "preset-fancy-breathe-scale-wiggle",
    "name": "Breathe",
    "needNewTag": true,
    "imgUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/breathe-scale-wiggle.png",
    "riveUrl": "https://public.cdn.opus.pro/clip-web/images/fancy-template-thumbnails/rive/breathe.riv",
    "preferences": {
      "enableAutoLayout": false,
      "enableFillLayout": true,
      "enableFitLayout": true,
      "fitLayoutCropRatio": "4:3",
      "enableSplitLayout": true,
      "enableThreeLayout": true,
      "enableFourLayout": true,
      "enableScreenLayout": true,
      "enableVisualHook": false,
      "enableWatermark": false,
      "enableCrop": true,
      "layoutAspectRatio": "portrait",
      "enableCaption": true,
      "enableCaptionAnimation": true,
      "captionAnimation": {
        "name": "breathe-scale-wiggle",
        "highlightColor": "#F5F5F5",
        "bgColor": "#1F1F1F"
      },
      "captionStyle": "",
      "captionPosition": "auto",
      "enableHighlight": true,
      "enableEmoji": false,
      "emojiStyle": null,
      "enableUppercase": true,
      "highlightColor": {
        "primary": "#F5F5F5",
        "secondary": "#F5F5F5"
      },
      "font": {
        "size": "Large",
        "numericalSize": 44,
        "color": "#FFFFFF",
        "stroke": {
          "enabled": true,
          "color": "#000000",
          "width": 10
        },
        "style": [
          "400"
        ],
        "textDecoration": "",
        "family": "LilitaOne",
        "shadow": {
          "enabled": true,
          "color": "#BDBDBD",
          "x": 3,
          "y": 3,
          "blur": 4
        }
      },
      "screenOverlay": null,
      "screenOverlays": [],
      "screenOverlayFileId": null,
      "enableBroll": null,
      "sceneDetThresh": 3,
      "reduceFakeFace": true
    }
  }
  ] as OpusCaptionTemplate[];
export const OPUS_CAPTION_TEMPLATES = [OPUS_NONE_TEMPLATE, ...OPUS_FANCY_TEMPLATES] as OpusCaptionTemplate[];
export const OPUS_FONT_FAMILIES = [
  "Komika-axis",
  "Montserrat",
  "The bold font",
  "Bernina Sans",
  "Poppins",
  "Bangers",
  "Koulen",
  "Bebas Neue",
  "Roboto",
  "Work sans",
  "Sora",
  "Fira Sans",
  "Spline Sans",
  "Anton",
  "Red Hat Display",
  "Oswald",
  "Optima",
  "Archivo",
  "Heebo",
  "Kanit",
  "Lemon",
  "Lilita One",
  "Poltawski Nowy",
  "Thabit",
  "Karla"
] as const;
export const OPUS_TRANSITION_STYLES = [
  {
    "id": "word-level_karaoke_fill-pop",
    "label": "Word Level Karaoke Fill Pop"
  },
  {
    "id": "pop",
    "label": "Pop"
  },
  {
    "id": "deep-diver",
    "label": "Deep Diver"
  },
  {
    "id": "scale",
    "label": "Scale"
  },
  {
    "id": "word-level_karaoke_bg-highlight",
    "label": "Word Level Karaoke Bg Highlight"
  },
  {
    "id": "glitch-infinite-zoom",
    "label": "Glitch Infinite Zoom"
  },
  {
    "id": "seamless-bounce",
    "label": "Seamless Bounce"
  },
  {
    "id": "baby-earthquake",
    "label": "Baby Earthquake"
  },
  {
    "id": "blur-switch",
    "label": "Blur Switch"
  },
  {
    "id": "word-level_simple_bg-highlight",
    "label": "Word Level Simple Bg Highlight"
  },
  {
    "id": "individual-focus",
    "label": "Individual Focus"
  },
  {
    "id": "blur-in",
    "label": "Blur In"
  },
  {
    "id": "simple-words-pop",
    "label": "Simple Words Pop"
  },
  {
    "id": "slide-in-from-top",
    "label": "Slide In From Top"
  },
  {
    "id": "hover",
    "label": "Hover"
  },
  {
    "id": "scale-in",
    "label": "Scale In"
  },
  {
    "id": "breathe-scale-wiggle",
    "label": "Breathe Scale Wiggle"
  }
] as const;
export const formatOpusTemplateLabel = (templateId: string, fallback = "") => {
  const raw = templateId.replace(/^preset-fancy-/, "").replace(/_/g, " ").replace(/-/g, " ");
  const normalized = raw.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return fallback || "Untitled";
  }
  return normalized.replace(/\b\w/g, (m) => m.toUpperCase());
};
export const formatOpusFontLabel = (fontFamily: string) => {
  if (!fontFamily) return "";
  if (fontFamily.includes(" ")) return fontFamily;
  return fontFamily
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
};
export const formatOpusTransitionLabel = (transitionName: string) => {
  if (!transitionName) return "";
  return transitionName
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
};
