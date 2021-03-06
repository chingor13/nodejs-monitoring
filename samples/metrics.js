// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * This application demonstrates how to perform basic operations on metrics with
 * the Google Stackdriver Monitoring API.
 *
 * For more information, see the README.md under /monitoring and the
 * documentation at https://cloud.google.com/monitoring/docs.
 */

'use strict';

async function createMetricDescriptor(projectId) {
  // [START monitoring_create_metric]
  // Imports the Google Cloud client library
  const monitoring = require('@google-cloud/monitoring');

  // Creates a client
  const client = new monitoring.MetricServiceClient();

  /**
   * TODO(developer): Uncomment and edit the following lines of code.
   */
  // const projectId = 'YOUR_PROJECT_ID';

  const request = {
    name: client.projectPath(projectId),
    metricDescriptor: {
      description: 'Daily sales records from all branch stores.',
      displayName: 'Daily Sales',
      type: 'custom.googleapis.com/stores/daily_sales',
      metricKind: 'GAUGE',
      valueType: 'DOUBLE',
      unit: '{USD}',
      labels: [
        {
          key: 'store_id',
          valueType: 'STRING',
          description: 'The ID of the store.',
        },
      ],
    },
  };

  // Creates a custom metric descriptor
  const [descriptor] = await client.createMetricDescriptor(request);
  console.log('Created custom Metric:\n');
  console.log(`Name: ${descriptor.displayName}`);
  console.log(`Description: ${descriptor.description}`);
  console.log(`Type: ${descriptor.type}`);
  console.log(`Kind: ${descriptor.metricKind}`);
  console.log(`Value Type: ${descriptor.valueType}`);
  console.log(`Unit: ${descriptor.unit}`);
  console.log('Labels:');
  descriptor.labels.forEach(label => {
    console.log(`  ${label.key} (${label.valueType}) - ${label.description}`);
  });
  // [END monitoring_create_metric]
}

async function listMetricDescriptors(projectId) {
  // [START monitoring_list_descriptors]
  // Imports the Google Cloud client library
  const monitoring = require('@google-cloud/monitoring');

  // Creates a client
  const client = new monitoring.MetricServiceClient();

  /**
   * TODO(developer): Uncomment and edit the following lines of code.
   */
  // const projectId = 'YOUR_PROJECT_ID';

  const request = {
    name: client.projectPath(projectId),
  };

  // Lists metric descriptors
  const [descriptors] = await client.listMetricDescriptors(request);
  console.log('Metric Descriptors:');
  descriptors.forEach(descriptor => console.log(descriptor.name));

  // [END monitoring_list_descriptors]
}

async function getMetricDescriptor(projectId, metricId) {
  // [START monitoring_get_descriptor]
  // Imports the Google Cloud client library
  const monitoring = require('@google-cloud/monitoring');

  // Creates a client
  const client = new monitoring.MetricServiceClient();

  /**
   * TODO(developer): Uncomment and edit the following lines of code.
   */
  // const projectId = 'YOUR_PROJECT_ID';
  // const metricId = 'custom.googleapis.com/your/id';

  const request = {
    name: client.projectMetricDescriptorPath(projectId, metricId),
  };

  // Retrieves a metric descriptor
  const [descriptor] = await client.getMetricDescriptor(request);
  console.log(`Name: ${descriptor.displayName}`);
  console.log(`Description: ${descriptor.description}`);
  console.log(`Type: ${descriptor.type}`);
  console.log(`Kind: ${descriptor.metricKind}`);
  console.log(`Value Type: ${descriptor.valueType}`);
  console.log(`Unit: ${descriptor.unit}`);
  console.log('Labels:');
  descriptor.labels.forEach(label => {
    console.log(`  ${label.key} (${label.valueType}) - ${label.description}`);
  });
  // [END monitoring_get_descriptor]
}

async function deleteMetricDescriptor(projectId, metricId) {
  // [START monitoring_delete_metric]
  // Imports the Google Cloud client library
  const monitoring = require('@google-cloud/monitoring');

  // Creates a client
  const client = new monitoring.MetricServiceClient();

  /**
   * TODO(developer): Uncomment and edit the following lines of code.
   */
  // const projectId = 'YOUR_PROJECT_ID';
  // const metricId = 'custom.googleapis.com/stores/daily_sales';

  const request = {
    name: client.projectMetricDescriptorPath(projectId, metricId),
  };

  // Deletes a metric descriptor
  const [result] = await client.deleteMetricDescriptor(request);
  console.log(`Deleted ${metricId}`, result);

  // [END monitoring_delete_metric]
}

async function writeTimeSeriesData(projectId) {
  // [START monitoring_write_timeseries]
  // Imports the Google Cloud client library
  const monitoring = require('@google-cloud/monitoring');

  // Creates a client
  const client = new monitoring.MetricServiceClient();

  /**
   * TODO(developer): Uncomment and edit the following lines of code.
   */
  // const projectId = 'YOUR_PROJECT_ID';

  const dataPoint = {
    interval: {
      endTime: {
        seconds: Date.now() / 1000,
      },
    },
    value: {
      doubleValue: 123.45,
    },
  };

  const timeSeriesData = {
    metric: {
      type: 'custom.googleapis.com/stores/daily_sales',
      labels: {
        store_id: 'Pittsburgh',
      },
    },
    resource: {
      type: 'global',
      labels: {
        project_id: projectId,
      },
    },
    points: [dataPoint],
  };

  const request = {
    name: client.projectPath(projectId),
    timeSeries: [timeSeriesData],
  };

  // Writes time series data
  const result = await client.createTimeSeries(request);
  console.log(`Done writing time series data.`, result);

  // [END monitoring_write_timeseries]
}

async function readTimeSeriesData(projectId, filter) {
  // [START monitoring_read_timeseries_simple]
  // Imports the Google Cloud client library
  const monitoring = require('@google-cloud/monitoring');

  // Creates a client
  const client = new monitoring.MetricServiceClient();

  /**
   * TODO(developer): Uncomment and edit the following lines of code.
   */
  // const projectId = 'YOUR_PROJECT_ID';
  // const filter = 'metric.type="compute.googleapis.com/instance/cpu/utilization"';

  const request = {
    name: client.projectPath(projectId),
    filter: filter,
    interval: {
      startTime: {
        // Limit results to the last 20 minutes
        seconds: Date.now() / 1000 - 60 * 20,
      },
      endTime: {
        seconds: Date.now() / 1000,
      },
    },
  };

  // Writes time series data
  const [timeSeries] = await client.listTimeSeries(request);
  timeSeries.forEach(data => {
    console.log(`${data.metric.labels.instance_name}:`);
    data.points.forEach(point => {
      console.log(JSON.stringify(point.value));
    });
  });

  // [END monitoring_read_timeseries_simple]
}

async function readTimeSeriesFields(projectId) {
  // [START monitoring_read_timeseries_fields]
  // Imports the Google Cloud client library
  const monitoring = require('@google-cloud/monitoring');

  // Creates a client
  const client = new monitoring.MetricServiceClient();

  /**
   * TODO(developer): Uncomment and edit the following lines of code.
   */
  // const projectId = 'YOUR_PROJECT_ID';

  const request = {
    name: client.projectPath(projectId),
    filter: 'metric.type="compute.googleapis.com/instance/cpu/utilization"',
    interval: {
      startTime: {
        // Limit results to the last 20 minutes
        seconds: Date.now() / 1000 - 60 * 20,
      },
      endTime: {
        seconds: Date.now() / 1000,
      },
    },
    // Don't return time series data, instead just return information about
    // the metrics that match the filter
    view: 'HEADERS',
  };

  // Writes time series data
  const [timeSeries] = await client.listTimeSeries(request);
  console.log('Found data points for the following instances:');
  timeSeries.forEach(data => {
    console.log(data.metric.labels.instance_name);
  });

  // [END monitoring_read_timeseries_fields]
}

async function readTimeSeriesAggregate(projectId) {
  // [START monitoring_read_timeseries_align]
  // Imports the Google Cloud client library
  const monitoring = require('@google-cloud/monitoring');

  // Creates a client
  const client = new monitoring.MetricServiceClient();

  /**
   * TODO(developer): Uncomment and edit the following lines of code.
   */
  // const projectId = 'YOUR_PROJECT_ID';

  const request = {
    name: client.projectPath(projectId),
    filter: 'metric.type="compute.googleapis.com/instance/cpu/utilization"',
    interval: {
      startTime: {
        // Limit results to the last 20 minutes
        seconds: Date.now() / 1000 - 60 * 20,
      },
      endTime: {
        seconds: Date.now() / 1000,
      },
    },
    // Aggregate results per matching instance
    aggregation: {
      alignmentPeriod: {
        seconds: 600,
      },
      perSeriesAligner: 'ALIGN_MEAN',
    },
  };

  // Writes time series data
  const [timeSeries] = await client.listTimeSeries(request);
  console.log('CPU utilization:');
  timeSeries.forEach(data => {
    console.log(data);
    for (const point of data.points) {
      console.log(point);
    }
    console.log(data.metric.labels.instance_name);
    console.log(`  Now: ${data.points[0].value.doubleValue}`);
    console.log(`  10 min ago: ${data.points[1].value.doubleValue}`);
  });
  // [END monitoring_read_timeseries_align]
}

async function readTimeSeriesReduce(projectId) {
  // [START monitoring_read_timeseries_reduce]
  // Imports the Google Cloud client library
  const monitoring = require('@google-cloud/monitoring');

  // Creates a client
  const client = new monitoring.MetricServiceClient();

  /**
   * TODO(developer): Uncomment and edit the following lines of code.
   */
  // const projectId = 'YOUR_PROJECT_ID';

  const request = {
    name: client.projectPath(projectId),
    filter: 'metric.type="compute.googleapis.com/instance/cpu/utilization"',
    interval: {
      startTime: {
        // Limit results to the last 20 minutes
        seconds: Date.now() / 1000 - 60 * 20,
      },
      endTime: {
        seconds: Date.now() / 1000,
      },
    },
    // Aggregate results per matching instance
    aggregation: {
      alignmentPeriod: {
        seconds: 600,
      },
      crossSeriesReducer: 'REDUCE_MEAN',
      perSeriesAligner: 'ALIGN_MEAN',
    },
  };

  // Writes time series data
  const [result] = await client.listTimeSeries(request);
  if (result.length === 0) {
    console.log('No data');
    return;
  }
  const reductions = result[0].points;

  console.log('Average CPU utilization across all GCE instances:');
  console.log(`  Last 10 min: ${reductions[0].value.doubleValue}`);
  console.log(`  10-20 min ago: ${reductions[0].value.doubleValue}`);

  // [END monitoring_read_timeseries_reduce]
}

async function listMonitoredResourceDescriptors(projectId) {
  // [START monitoring_list_resources]
  // Imports the Google Cloud client library
  const monitoring = require('@google-cloud/monitoring');

  // Creates a client
  const client = new monitoring.MetricServiceClient();

  /**
   * TODO(developer): Uncomment and edit the following lines of code.
   */
  // const projectId = 'YOUR_PROJECT_ID';

  const request = {
    name: client.projectPath(projectId),
  };

  // Lists monitored resource descriptors
  const [descriptors] = await client.listMonitoredResourceDescriptors(request);
  console.log('Monitored Resource Descriptors:');
  descriptors.forEach(descriptor => {
    console.log(descriptor.name);
    console.log(`  Type: ${descriptor.type}`);
    if (descriptor.labels) {
      console.log(`  Labels:`);
      descriptor.labels.forEach(label => {
        console.log(
          `    ${label.key} (${label.valueType}): ${label.description}`
        );
      });
    }
    console.log();
  });

  // [END monitoring_list_resources]
}

async function getMonitoredResourceDescriptor(projectId, resourceType) {
  // [START monitoring_get_resource]
  // Imports the Google Cloud client library
  const monitoring = require('@google-cloud/monitoring');

  // Creates a client
  const client = new monitoring.MetricServiceClient();

  /**
   * TODO(developer): Uncomment and edit the following lines of code.
   */
  // const projectId = 'YOUR_PROJECT_ID';
  // const resourceType = 'some_resource_type, e.g. cloudsql_database';

  const request = {
    name: client.projectMonitoredResourceDescriptorPath(
      projectId,
      resourceType
    ),
  };

  // Lists monitored resource descriptors
  const [descriptor] = await client.getMonitoredResourceDescriptor(request);

  console.log(`Name: ${descriptor.displayName}`);
  console.log(`Description: ${descriptor.description}`);
  console.log(`Type: ${descriptor.type}`);
  console.log('Labels:');
  descriptor.labels.forEach(label => {
    console.log(`  ${label.key} (${label.valueType}) - ${label.description}`);
  });
  // [END monitoring_get_resource]
}

const cli = require(`yargs`)
  .demand(1)
  .command(
    `create [projectId]`,
    `Creates an example 'custom.googleapis.com/stores/daily_sales' custom metric descriptor.`,
    {},
    opts => createMetricDescriptor(opts.projectId)
  )
  .command(`list [projectId]`, `Lists metric descriptors.`, {}, opts =>
    listMetricDescriptors(opts.projectId)
  )
  .command(`get <metricId> [projectId]`, `Get a metric descriptor.`, {}, opts =>
    getMetricDescriptor(opts.projectId, opts.metricId)
  )
  .command(
    `delete <metricId> [projectId]`,
    `Deletes a custom metric descriptor.`,
    {},
    opts => deleteMetricDescriptor(opts.projectId, opts.metricId)
  )
  .command(
    `write [projectId]`,
    `Writes example time series data to 'custom.googleapis.com/stores/daily_sales'.`,
    {},
    opts => writeTimeSeriesData(opts.projectId)
  )
  .command(
    `read <filter> [projectId]`,
    `Reads time series data that matches the given filter.`,
    {},
    opts => readTimeSeriesData(opts.projectId, opts.filter)
  )
  .command(
    `read-fields [projectId]`,
    `Reads headers of time series data that matches 'compute.googleapis.com/instance/cpu/utilization'.`,
    {},
    opts => readTimeSeriesFields(opts.projectId)
  )
  .command(
    `read-aggregate [projectId]`,
    `Aggregates time series data that matches 'compute.googleapis.com/instance/cpu/utilization'.`,
    {},
    opts => readTimeSeriesAggregate(opts.projectId)
  )
  .command(
    `read-reduce [projectId]`,
    `Reduces time series data that matches 'compute.googleapis.com/instance/cpu/utilization'.`,
    {},
    opts => readTimeSeriesReduce(opts.projectId)
  )
  .command(
    `list-resources [projectId]`,
    `Lists monitored resource descriptors.`,
    {},
    opts => listMonitoredResourceDescriptors(opts.projectId)
  )
  .command(
    `get-resource <resourceType> [projectId]`,
    `Get a monitored resource descriptor.`,
    {},
    opts => getMonitoredResourceDescriptor(opts.projectId, opts.resourceType)
  )
  .options({
    projectId: {
      alias: 'p',
      default: process.env.GCLOUD_PROJECT,
      global: true,
      requiresArg: true,
      type: 'string',
    },
  })
  .example(`node $0 create`)
  .example(`node $0 list`)
  .example(`node $0 get logging.googleapis.com/log_entry_count`)
  .example(`node $0 delete custom.googleapis.com/stores/daily_sales`)
  .example(`node $0 list-resources`)
  .example(`node $0 get-resource cloudsql_database`)
  .example(`node $0 write`)
  .example(
    `node $0 read 'metric.type="compute.googleapis.com/instance/cpu/utilization"'`
  )
  .example(`node $0 read-fields`)
  .example(`node $0 read-aggregate`)
  .example(`node $0 read-reduce`)
  .wrap(120)
  .recommendCommands()
  .epilogue(
    `For more information, see https://cloud.google.com/monitoring/docs`
  );

if (module === require.main) {
  cli.help().strict().argv; // eslint-disable-line
}
