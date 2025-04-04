pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds') // DockerHub credentials
    DOCKERHUB_USERNAME = 'nandhini1694'
    BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/mern-backend:latest"
    FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/mern-frontend:latest"
  }

  stages {
    stage('Checkout Code') {
      steps {
        git branch: 'main', url: 'https://github.com/itsnandhu2004/mern-dev.git'
      }
    }

    stage('Build Backend Docker Image') {
      steps {
        dir('backend') {
          script {
            sh "docker build -t ${BACKEND_IMAGE} -f Dockerfile ."
          }
        }
      }
    }

    stage('Build Frontend Docker Image') {
      steps {
        dir('frontend') {
          script {
            sh "docker build -t ${FRONTEND_IMAGE} -f Dockerfile ."
          }
        }
      }
    }

    stage('Push Docker Images') {
      steps {
        withDockerRegistry([ credentialsId: 'dockerhub-creds', url: '' ]) {
          sh "docker push ${BACKEND_IMAGE}"
          sh "docker push ${FRONTEND_IMAGE}"
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh 'kubectl apply -f k8s-manifests/backend-deployment.yaml'
        sh 'kubectl apply -f k8s-manifests/frontend-deployment.yaml'
      }
    }

    stage('Get Frontend URL') {
      steps {
        script {
          def frontend_url = sh(script: "minikube service frontend-service --url", returnStdout: true).trim()
          echo "✅ Your MERN app frontend is accessible at: ${frontend_url}"
        }
      }
    }
  }

  post {
    failure {
      echo "❌ Build failed! Please check the console logs."
    }
    success {
      echo "✅ CI/CD pipeline completed successfully!"
    }
  }
}
