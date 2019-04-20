pipeline {
  environment {
    registry = "dirty49374/wrtacc"
    registryCredential = 'dockerhub'
  }
  agent any
  stages {
    stage('Building image') {
      steps{
        script {
          docker.build registry + ":0.0.$BUILD_NUMBER"
        }
      }
    }
  }
}
