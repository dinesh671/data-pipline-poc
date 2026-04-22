import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";

export class EtlOrcStack extends cdk.Stack {
  public readonly handler: lambda.Function;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 bucket
    const bucket = new s3.Bucket(this, "mybucket", {
      bucketName: "data-pipe-uploads",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const entryPath = path.join(process.cwd(), 'src', 'backend', 'preprocess');

    const validate_layer = new lambda.LayerVersion(this, 'CommonDepsLayer', {
            code: lambda.Code.fromAsset('src/backend/validate_layer'),
            compatibleRuntimes: [lambda.Runtime.PYTHON_3_11],
            description: 'Shared dependencies for all microservices ',
        });

    this.handler = new lambda.Function(this, 'UploadValidator', {
      functionName: `upload-validator`,
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'main.handler',
      architecture: lambda.Architecture.X86_64,
      timeout: cdk.Duration.seconds(30),
      environment: {
        Bucket_Name: bucket.bucketName,
      },
      // NO BUNDLING HERE: GitHub Actions handles it!
      code: lambda.Code.fromAsset(entryPath),
      layers: [validate_layer],


    });

    bucket.grantReadWrite(this.handler)
  }
}