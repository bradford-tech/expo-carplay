import ExpoCarPlay from '../../ExpoCarPlayModule';
import { setFollowMode } from '../map';

jest.mock('../../ExpoCarPlayModule', () => ({
  __esModule: true,
  default: { setFollowMode: jest.fn().mockResolvedValue(undefined) },
}));

describe('setFollowMode', () => {
  it('forwards the mode string to the native module', async () => {
    await setFollowMode('browseHeadingUp');
    expect(ExpoCarPlay.setFollowMode).toHaveBeenCalledWith('browseHeadingUp');
  });
});
