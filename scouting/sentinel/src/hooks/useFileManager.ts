import fs, { ReadDirItem } from 'react-native-fs';
import { unzip, zip } from 'react-native-zip-archive';
import { TFileManager, TLogStructure } from '../../types';
import { TLog } from '../../../common/types';
import { TDenseLog } from '../../../common/types';
import { useAssignment } from '../contexts/AssignmentContext';
import { yearConfig } from '../../../common/helpers';
import DeviceInfo from 'react-native-device-info';

export const useFileManager: () => TFileManager = (): TFileManager => {
  const { event } = useAssignment();

  const logsRoot = `${fs.DocumentDirectoryPath}/logs`;
  const logsEvent = `${logsRoot}/${event}`;
  const unzippedLogsPath = `${logsEvent}/unzipped`;
  const zippedLogsPath = `${logsEvent}/zipped`;
  const tempPath = `${fs.DocumentDirectoryPath}/temp`;
  const assignmentFilePath = `${fs.DocumentDirectoryPath}/assignment`;

  const createBaseDirs: TFileManager['createBaseDirs'] = async (): Promise<void> => {
    const promises: Promise<void>[] = [];
    promises.push(fs.mkdir(logsRoot));
    promises.push(fs.mkdir(tempPath));

    await Promise.all(promises);
  };

  const saveLog: TFileManager['saveLog'] = async <eventType>(
    log: TLog<eventType>
  ): Promise<string> => {
    let denseLog: TDenseLog = {
      t: log.teamNum, // teamNum
      m: log.matchNum, // matchNum
      e: [], // events
      s: log.scouter, // scouter
      a: log.alliance, // alliance
      p: log.alliancePos, // alliancePos
    };

    const eventKeyToDense = yearConfig(DeviceInfo.getVersion()).eventKeyToDense;

    denseLog.e = log.events.map((event: eventType): Record<string, any> => {
      let denseEvent: Record<string, any> = {};

      for (const key in event) {
        denseEvent[eventKeyToDense[key]] = event[key];
      }

      return denseEvent;
    });

    const fileName: string = `${log.alliance}-${log.alliancePos}-match-${log.matchNum}`;
    const logString: string = JSON.stringify(denseLog);

    await fs.mkdir(unzippedLogsPath);
    await fs.mkdir(zippedLogsPath);

    await fs.writeFile(`${unzippedLogsPath}/${fileName}`, logString);

    await zip([`${unzippedLogsPath}/${fileName}`], `${zippedLogsPath}/${fileName}`);
    await fs.unlink(`${unzippedLogsPath}/${fileName}`);

    return `${zippedLogsPath}/${fileName}`;
  };

  const getZippedLog: TFileManager['getZippedLog'] = async (path: string): Promise<string> => {
    return await fs.readFile(path, 'base64');
  };

  const deleteFile: TFileManager['deleteFile'] = async (path: string): Promise<void> => {
    await fs.unlink(path);
  };

  const unzipB64: TFileManager['unzipB64'] = async (
    inputB64: string,
    outFilePath: string,
    fileName: string
  ): Promise<string> => {
    const tempZip: string = `${tempPath}/t.zip`;

    try {
      await fs.writeFile(tempZip, inputB64, 'base64');
    } catch (e) {
      console.log('Unable to write file: ', e);
    }

    try {
      await unzip(tempZip, outFilePath, 'US-ASCII');
    } catch (e) {
      console.log('Unable to unzip file: ', e);
    }

    try {
      await fs.unlink(tempZip);
    } catch (e) {
      console.log('Deleting zip file failed: ', e);
    }

    const output: string = await fs.readFile(`${outFilePath}/${fileName}`);

    return output;
  };

  const getLogStructure: TFileManager['getLogStructure'] = async (): Promise<TLogStructure> => {
    const eventDirs: ReadDirItem[] = await fs.readDir(logsRoot);

    const logStructure: TLogStructure = eventDirs
      .filter((dir: ReadDirItem): (() => boolean) => dir.isDirectory)
      .reduce(
        (structure: TLogStructure, eventDir: ReadDirItem): TLogStructure => ({
          ...structure,
          [eventDir.name]: [],
        }),
        {}
      );

    for (const event in logStructure) {
      try {
        logStructure[event] = await getEventLogInfo(event);
      } catch (error) {
        console.log(error);
      }
    }

    return logStructure;
  };

  const getEventLogInfo: TFileManager['getEventLogInfo'] = async (
    eventName: string
  ): Promise<TLogStructure['event']> => {
    const files: ReadDirItem[] = await fs.readDir(`${logsRoot}/${eventName}/zipped`);

    const logInfo: TLogStructure['event'] = files
      .filter((file: ReadDirItem): (() => boolean) => file.isFile)
      .map((file: ReadDirItem): { name: string; path: string } => ({
        name: file.name,
        path: file.path,
      }));

    return logInfo;
  };

  const unzipAssignment: TFileManager['unzipAssignment'] = async (
    assignmentB64: string
  ): Promise<string> => {
    return await unzipB64(assignmentB64, assignmentFilePath, 'assignment.txt');
  };

  const getLastMatchNumber: TFileManager['getLastMatchNumber'] = async (
    eventName: string
  ): Promise<number | undefined> => {
    console.log(`Loading event ${eventName}`);

    await fs.mkdir(`${logsRoot}/${eventName}/unzipped`);
    await fs.mkdir(`${logsRoot}/${eventName}/zipped`);
    const logInfo: TLogStructure['event'] = await getEventLogInfo(eventName);
    const lastMatchNum: number | undefined = logInfo
      .map((x): number => {
        return parseInt(x.name.split('-')[3], 10);
      })
      .sort((a: number, b: number): number => b - a)[0];
    console.log(`Starting ${eventName} from match ${lastMatchNum}`);
    return lastMatchNum;
  };

  return {
    createBaseDirs,
    unzipAssignment,
    unzipB64,
    saveLog,
    getZippedLog,
    getEventLogInfo,
    getLogStructure,
    deleteFile,
    getLastMatchNumber,
  };
};
