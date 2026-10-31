import { t } from '@/shared/i18n';

const ACTIVE_COLOR = '#34c98e';
const INACTIVE_COLOR = '#8590a6';
const GLYPH_COLOR = '#052e1f';
const ROTATION_DEGREES = -28;

const TRACK_PATH = new Path2D('M8 6.5h8a5.5 5.5 0 0 1 0 11H8a5.5 5.5 0 0 1 0-11Z');
const BAR_PATH = new Path2D('M10 12h4');

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
  context.rotate((ROTATION_DEGREES * Math.PI) / 180);
  context.translate(-12, -12);
  context.strokeStyle = GLYPH_COLOR;
  context.lineWidth = 2.6;
  context.lineCap = 'round';
  context.stroke(TRACK_PATH);
  context.stroke(BAR_PATH);
  return context.getImageData(0, 0, size, size);
}

export async function updateActionIcon(active: boolean): Promise<void> {
  const background = active ? ACTIVE_COLOR : INACTIVE_COLOR;
  await Promise.all([
    chrome.action.setIcon({
      imageData: {16: renderIcon(16, background), 32: renderIcon(32, background)},
    }),
    chrome.action.setTitle({title: `Baton · ${active ? t.status.running : t.status.stopped}`}),
  ]);
}
