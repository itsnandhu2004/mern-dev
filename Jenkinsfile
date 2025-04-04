





pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "nandhini1694/mern-backend:latest"
        FRONTEND_IMAGE = "nandhini1694/mern-frontend:latest"
        MINIKUBE_IP = "192.168.49.2" // Replace with the actual Minikube IP
        FRONTEND_PORT = "30423" // Replace with the port of your frontend service
    }

    stages {
        stage('Checkout Code') {
            steps {
                cleanWs()  // Ensures a fresh workspace
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

        stage('Start Minikube & Expose Service') {
            steps {
                script {
                    // Start Minikube (if not already started)
                    sh "minikube start"

                    // Expose the frontend service via port-forwarding in the background
                    sh """
                        nohup kubectl port-forward svc/frontend-service ${FRONTEND_PORT}:80 &
                        sleep 10
                    """
                    
                    // Optionally, log the service URL for verification
                    echo "Frontend service is available at http://${MINIKUBE_IP}:${FRONTEND_PORT}"
                }
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
    }

    post {
        success {
            echo "🎉 Deployment completed successfully! Visit the frontend at http://${MINIKUBE_IP}:${FRONTEND_PORT}."
        }
        failure {
            echo "❌ Build failed! Please check the console logs."
        }
    }
}
