pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "nandhini1694/mern-backend:latest"
        FRONTEND_IMAGE = "nandhini1694/mern-frontend:latest"
    }

    stages {
        stage('Checkout Code') {
            steps {
                cleanWs()
                git branch: 'main', url: 'https://github.com/itsnandhu2004/mern-dev.git'
                echo "✅ Code successfully checked out!"
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('mern-todo-app-master/backend') {
                    sh "docker build -t ${BACKEND_IMAGE} -f Dockerfile ."
                }
                echo "✅ Backend Docker image built successfully!"
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('mern-todo-app-master/frontend') {
                    sh "docker build -t ${FRONTEND_IMAGE} -f Dockerfile ."
                }
                echo "✅ Frontend Docker image built successfully!"
            }
        }

        stage('Push Docker Images') {
            steps {
                withDockerRegistry(credentialsId: 'dockerhub-creds', url: '') {
                    sh "docker push ${BACKEND_IMAGE}"
                    sh "docker push ${FRONTEND_IMAGE}"
                }
                echo "✅ Docker images pushed to Docker Hub successfully!"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                dir('k8s-manifests') {
                    withEnv(["KUBECONFIG=/var/lib/jenkins/.kube/config"]) {
                        sh """
                            kubectl apply -f backend-deployment.yaml
                            kubectl apply -f frontend-deployment.yaml
                        """
                    }
                }
                echo "🚀 Deployment to Kubernetes completed successfully!"
            }
        }

        stage('Expose Frontend (Port Forward on 9001)') {
            steps {
                withEnv(["KUBECONFIG=/var/lib/jenkins/.kube/config"]) {
                    script {
                        // Forward to port 9001 instead of 8080
                        sh "nohup kubectl port-forward svc/frontend-service 9001:80 > portforward.log 2>&1 &"
                        echo "🌐 Frontend is now accessible at: http://localhost:9001"
                    }
                }
            }
        }
    }

    post {
        success {
            echo "🎉 Deployment completed successfully! Visit http://localhost:9090 to access the app."
        }
        failure {
            echo "❌ Build failed! Please check the console logs."
        }
    }
}
