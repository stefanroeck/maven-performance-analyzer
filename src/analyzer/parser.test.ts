import { FileDownload, LastTimestamp, parse, parseTimestamp } from "./parser";

describe("parser", () => {
  it("parses single line with millis", () => {
    const line =
      "2022-11-08 19:00:12,500 [INFO] --- maven-remote-resources-plugin:1.7.0:process (process-resource-bundles) @ httpcore5-reactive ---";

    const result = parse(line).lines[0];
    expect(result).toMatchObject({
      goal: "process (process-resource-bundles)",
      plugin: "maven-remote-resources-plugin",
      module: "httpcore5-reactive",
    });
    expect(result.startTime).toEqual(new Date("2022-11-08T18:00:12.500Z"));
  });

  it("parses single line without millis", () => {
    const line =
      "2022-11-08 19:00:12 [INFO] --- maven-remote-resources-plugin:1.7.0:process (process-resource-bundles) @ httpcore5-reactive ---";

    const result = parse(line).lines[0];
    expect(result).toMatchObject({
      goal: "process (process-resource-bundles)",
      plugin: "maven-remote-resources-plugin",
      module: "httpcore5-reactive",
    });
    expect(result.startTime).toEqual(new Date("2022-11-08T18:00:12.000Z"));
  });

  it("parses line without thread name", () => {
    const line =
      "2022-11-08 19:00:12 [INFO] --- maven-remote-resources-plugin:1.7.0:process (process-resource-bundles) @ httpcore5-reactive ---";

    const result = parse(line).lines[0];

    expect(result.thread).toBeUndefined();
  });

  it("parses line with thread name", () => {
    const line =
      "2022-11-19 19:06:02,813 [mvn-builder-surefire] [INFO] --- maven-enforcer-plugin:3.0.0:enforce (enforce-maven-version) @ surefire ---";

    const result = parse(line).lines[0];

    expect(result.thread).toEqual("mvn-builder-surefire");
    expect(result.startTime).toEqual(new Date("2022-11-19T18:06:02.813Z"));
    expect(result.goal).toEqual("enforce (enforce-maven-version)");
    expect(result.module).toEqual("surefire");
    expect(result.plugin).toEqual("maven-enforcer-plugin");
  });

  it("parses line with another thread name", () => {
    const line =
      "2022-11-23 08:05:26,619 [BuilderThread 0] [INFO] --- maven-enforcer-plugin:3.0.0:enforce (enforce-maven-version) @ surefire ---";

    const result = parse(line).lines[0];

    expect(result.thread).toEqual("BuilderThread 0");
    expect(result.startTime).toEqual(new Date("2022-11-23T07:05:26.619Z"));
    expect(result.goal).toEqual("enforce (enforce-maven-version)");
    expect(result.module).toEqual("surefire");
    expect(result.plugin).toEqual("maven-enforcer-plugin");
  });

  it("parses jenkins build line", () => {
    const line =
      "[2022-11-29T20:07:14.966Z] [INFO] --- jacoco-maven-plugin:0.8.7:prepare-agent (default) @ module-one ---";

    const result = parse(line).lines[0];

    expect(result.thread).toBeUndefined();
    expect(result.startTime).toEqual(new Date("2022-11-29T20:07:14.966Z"));
    expect(result.goal).toEqual("prepare-agent (default)");
    expect(result.module).toEqual("module-one");
    expect(result.plugin).toEqual("jacoco-maven-plugin");
  });

  it("parses timestamp", () => {
    expect(parseTimestamp("2022-11-08 11:00:00,500")).toEqual(
      new Date("2022-11-08T10:00:00.500Z"),
    );
    expect(parseTimestamp("2022-11-08 11:00:00")).toEqual(
      new Date("2022-11-08T10:00:00.000Z"),
    );
  });

  it("parses lines from multiple threads", () => {
    const result = parse(
      "2022-11-19 19:06:06,153 [mvn-builder-surefire-logger-api] [INFO] --- maven-clean-plugin:3.2.0:clean (default-clean) @ surefire-logger-api ---\n" +
        "2022-11-19 19:06:06,156 [mvn-builder-surefire-shared-utils] [INFO] --- maven-clean-plugin:3.2.0:clean (default-clean) @ surefire-shared-utils ---\n",
    );

    expect(result.lines[0]).toMatchObject({
      goal: "clean (default-clean)",
      module: "surefire-logger-api",
      plugin: "maven-clean-plugin",
      thread: "mvn-builder-surefire-logger-api",
    });
    expect(result.lines[0].startTime).toEqual(
      new Date("2022-11-19T18:06:06.153Z"),
    );

    expect(result.lines[1]).toMatchObject({
      goal: "clean (default-clean)",
      module: "surefire-shared-utils",
      plugin: "maven-clean-plugin",
      thread: "mvn-builder-surefire-shared-utils",
    });
    expect(result.lines[1].startTime).toEqual(
      new Date("2022-11-19T18:06:06.156Z"),
    );
  });

  it("parses downloads", () => {
    const result = parse(
      "Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-model/3.6.1/maven-model-3.6.1.jar (186 kB at 1.4 MB/s)\n" +
        "Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-artifact-transfer/0.11.0/maven-artifact-transfer-0.11.0.jar (0 B at 0 B/s)\n" +
        "Downloaded from central: https://repo.maven.apache.org/maven2/xerces/xercesImpl/2.12.1/xercesImpl-2.12.1.jar (1.4 MB at 1.2 MB/s)\n",
    );

    expect(result.downloads).toEqual<FileDownload[]>([
      {
        resourceUrl:
          "https://repo.maven.apache.org/maven2/org/apache/maven/maven-model/3.6.1/maven-model-3.6.1.jar",
        sizeInBytes: 186 * 1024,
        timestamp: undefined,
        repository: "central",
      },
      {
        resourceUrl:
          "https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-artifact-transfer/0.11.0/maven-artifact-transfer-0.11.0.jar",
        sizeInBytes: 0,
        timestamp: undefined,
        repository: "central",
      },
      {
        resourceUrl:
          "https://repo.maven.apache.org/maven2/xerces/xercesImpl/2.12.1/xercesImpl-2.12.1.jar",
        sizeInBytes: 1.4 * 1024 * 1024,
        timestamp: undefined,
        repository: "central",
      },
    ]);
  });

  it("parse download with timestamp", () => {
    const result = parse(
      "[2022-11-30T17:53:13.391Z] [INFO] Downloaded from plugins: https://repo1.maven.org/maven2/org/zeroturnaround/jrebel-maven-plugin/1.1.10/jrebel-maven-plugin-1.1.10.pom (6.9 kB at 18 kB/s)",
    );
    expect(result.downloads).toMatchObject([
      {
        resourceUrl:
          "https://repo1.maven.org/maven2/org/zeroturnaround/jrebel-maven-plugin/1.1.10/jrebel-maven-plugin-1.1.10.pom",
        sizeInBytes: 6.9 * 1024,
        repository: "plugins",
      },
    ]);
    expect(result.downloads[0].timestamp).toEqual(
      new Date("2022-11-30T17:53:13.391Z"),
    );
  });

  it("parses lastTimestamp is goal", () => {
    const line =
      "2022-11-08 19:00:12 [INFO] --- maven-remote-resources-plugin:1.7.0:process (process-resource-bundles) @ httpcore5-reactive ---";

    const result = parse(line);

    expect(result.lastTimestamps).toEqual<LastTimestamp[]>([
      {
        thread: undefined,
        lastTimestamp: new Date("2022-11-08 19:00:12"),
      },
    ]);
  });

  it("parses lastTimestamp is another action", () => {
    const lines =
      "2022-11-08 19:00:12 [INFO] --- maven-remote-resources-plugin:1.7.0:process (process-resource-bundles) @ httpcore5-reactive ---\n" +
      "2022-11-08 19:00:15 [INFO] Building Apache HttpComponents Core Reactive Extensions 5.2.1-SNAPSHOT [4/5]";

    const result = parse(lines);

    expect(result.lastTimestamps).toEqual<LastTimestamp[]>([
      {
        lastTimestamp: new Date("2022-11-08 19:00:15"),
      },
    ]);
  });
});
