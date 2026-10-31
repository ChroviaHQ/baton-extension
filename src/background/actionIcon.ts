import { t } from '@/shared/i18n';
import {
  LOGO_ACTIVE_COLOR,
  LOGO_BAR_PATH,
  LOGO_GLYPH_COLOR,
  LOGO_INACTIVE_COLOR,
  LOGO_ROTATION_DEGREES,
  LOGO_TRACK_PATH,
} from '@/shared/logo';

const TRACK_PATH = new Path2D(LOGO_TRACK_PATH);
const BAR_PATH = new Path2D(LOGO_BAR_PATH);

function renderIcon(size: number, background: string): ImageData {
  const canvas = new OffscreenCanvas(size, size);
  const context = canvas.getContext('2d')!;
  context.scale(size / 1024, size / 1024);
  context.fillStyle = background;
  context.beginPath();
  context.roundRect(24, 24, 976, 976, 220);
  context.fill();
  context.translate(512, 512);
  context.scale(36, 36);
  context.rotate((LOGO_ROTATION_DEGREES * Math.PI) / 180);
  context.translate(-12, -12);
  context.strokeStyle = LOGO_GLYPH_COLOR;
  context.lineWidth = 2.6;
  context.lineCap = 'round';
  context.stroke(TRACK_PATH);
  context.stroke(BAR_PATH);
  return context.getImageData(0, 0, size, size);
}

export async function updateActionIcon(active: boolean): Promise<void> {
  const background = active ? LOGO_ACTIVE_COLOR : LOGO_INACTIVE_COLOR;
  await Promise.all([
    chrome.action.setIcon({
      imageData: {16: renderIcon(16, background), 32: renderIcon(32, background)},
    }),
    chrome.action.setTitle({title: `Baton · ${active ? t.status.running : t.status.stopped}`}),
  ]);
}
