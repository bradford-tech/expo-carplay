import ExpoCarPlay from '../../ExpoCarPlayModule';
import { setCameraGeometry, setFollowMode } from '../map';

jest.mock('../../ExpoCarPlayModule', () => ({
  __esModule: true,
  default: {
    setFollowMode: jest.fn().mockResolvedValue(undefined),
    setCameraGeometry: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('setFollowMode', () => {
  it('forwards the mode string to the native module', async () => {
    await setFollowMode('browseHeadingUp');
    expect(ExpoCarPlay.setFollowMode).toHaveBeenCalledWith('browseHeadingUp');
  });
});

describe('setCameraGeometry', () => {
  it('forwards the geometry to the native module', async () => {
    await setCameraGeometry({ browseDistance: 800, navigationPitch: 45 });
    expect(ExpoCarPlay.setCameraGeometry).toHaveBeenCalledWith({
      browseDistance: 800,
      navigationPitch: 45,
    });
  });

  it('passes a zero pitch through rather than dropping it as absent', async () => {
    // Zero is a legal pitch — the one the browse modes use — so it has to
    // survive the wrapper. Native marks "unset" with a negative value instead,
    // which is the whole reason zero cannot be the sentinel.
    await setCameraGeometry({ browsePitch: 0 });
    expect(ExpoCarPlay.setCameraGeometry).toHaveBeenCalledWith({
      browsePitch: 0,
    });
  });
});
