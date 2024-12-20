import { describe, expect, it } from "vitest";
import {
  analyze,
  AnalyzerMessages,
  GeneralStats,
  MavenPluginStats,
} from "./analyzer";

describe("analyzer", () => {
  it("calculates duration for single thread", () => {
    const lines = [
      {
        module: "m1",
        plugin: "p1",
        goal: "g1",
        startTime: new Date("2022-01-01 10:00:00"),
      },
      {
        module: "m1",
        plugin: "p2",
        goal: "g2",
        startTime: new Date("2022-01-01 10:00:05"),
      },
    ];

    const analysis = analyze({
      lines,
      lastTimestamps: [
        { thread: undefined, lastTimestamp: new Date("2022-01-01 10:00:15") },
      ],
      compiledSources: [],
      statistics: {},
      downloads: [],
      tests: [],
    });

    expect(analysis.mavenPlugins).toEqual<MavenPluginStats[]>([
      {
        module: lines[0].module,
        plugin: lines[0].plugin,
        thread: "main",
        startTime: lines[0].startTime,
        duration: 5000,
      },
      {
        module: lines[1].module,
        plugin: lines[1].plugin,
        thread: "main",
        startTime: lines[1].startTime,
        duration: 10000,
      },
    ]);
  });

  it("analyzes empty result", () => {
    const analysis = analyze({
      lines: [],
      compiledSources: [],
      lastTimestamps: [],
      statistics: {},
      downloads: [],
      tests: [],
    });

    expect(analysis.mavenPlugins).toEqual([]);
    expect(analysis.modules).toEqual([]);
    expect(analysis.messages).toEqual<AnalyzerMessages>({
      error:
        "No metrics could be found. Please make sure to provide a valid maven log file with timestamp information as described above.",
      info: undefined,
    });
    expect(analysis.tests).toEqual({
      errors: 0,
      failures: 0,
      skipped: 0,
      total: 0,
    });
    expect(analysis.stats).toEqual<GeneralStats>({
      multiThreaded: false,
      threads: 1,
      totalDownloadedBytes: 0,
      totalBuildTime: undefined,
      status: "unknown",
    });
  });

  it("calculates duration for multiple threads", () => {
    const thread1 = "t1";
    const thread2 = "t2";

    const lines = [
      {
        module: "m1",
        plugin: "p1",
        goal: "goal",
        thread: thread1,
        startTime: new Date("2022-01-01 10:00:00"),
      },
      {
        module: "m2",
        plugin: "p2",
        goal: "goal",
        thread: thread2,
        startTime: new Date("2022-01-01 10:00:00"),
      },
      {
        module: "m1",
        plugin: "p3", // end p1
        goal: "goal",
        thread: thread1,
        startTime: new Date("2022-01-01 10:00:02"),
      },
      {
        module: "m2",
        plugin: "p4", // end p2
        goal: "goal",
        thread: thread2,
        startTime: new Date("2022-01-01 10:00:03"),
      },
    ];

    const analysis = analyze({
      lines,
      lastTimestamps: [
        {
          thread: thread1,
          lastTimestamp: new Date("2022-01-01 10:00:15"),
        },
        {
          thread: thread2,
          lastTimestamp: new Date("2022-01-01 10:00:14"),
        },
      ],
      compiledSources: [],
      statistics: {
        multiThreadedThreads: 2,
      },
      downloads: [],
      tests: [],
    });

    expect(analysis.mavenPlugins[0]).toEqual<MavenPluginStats>({
      module: lines[0].module,
      plugin: lines[0].plugin,
      thread: thread1,
      startTime: lines[0].startTime,
      duration: 2000,
    });

    expect(analysis.mavenPlugins[1]).toEqual<MavenPluginStats>({
      module: lines[2].module,
      plugin: lines[2].plugin,
      thread: thread1,
      startTime: lines[2].startTime,
      duration: 13000,
    });
    expect(analysis.mavenPlugins[2]).toEqual<MavenPluginStats>({
      module: lines[1].module,
      plugin: lines[1].plugin,
      thread: thread2,
      startTime: lines[1].startTime,
      duration: 3000,
    });
    expect(analysis.mavenPlugins[3]).toEqual<MavenPluginStats>({
      module: lines[3].module,
      plugin: lines[3].plugin,
      thread: thread2,
      startTime: lines[3].startTime,
      duration: 11000,
    });
    expect(analysis.stats?.multiThreaded).toBeTruthy();
    expect(analysis.stats?.threads).toEqual(2);
  });

  it("does not return durations with 0", () => {
    const lines = [
      {
        module: "m1",
        plugin: "p1",
        goal: "g1",
        startTime: new Date("2022-01-01 10:00:00"),
      },
      {
        module: "m1",
        plugin: "p2",
        goal: "g2",
        startTime: new Date("2022-01-01 10:00:00"),
      },
    ];

    const analysis = analyze({
      lines,
      lastTimestamps: [
        { thread: undefined, lastTimestamp: new Date("2022-01-01 10:00:00") },
      ],
      compiledSources: [],
      statistics: {},
      downloads: [],
      tests: [],
    });

    expect(analysis.mavenPlugins).toEqual<MavenPluginStats[]>([]);
  });
});
