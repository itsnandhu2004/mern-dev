pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "nandhini1694/mern-backend:latest"
        FRONTEND_IMAGE = "nandhini1694/mern-frontend:latest"
        KUBECONFIG = "/var/lib/jenkins/.kube/config" // Path to kubeconfig on Jenkins server
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
                    withEnv(["KUBECONFIG=${KUBECONFIG}"]) {
                        script {
                            sh """
                                echo '🚀 Applying deployment YAMLs...'
                                kubectl apply -f backend-deployment.yaml
                                kubectl apply -f frontend-deployment.yaml

                                echo '📦 Getting Pods...'
                                kubectl get pods

                                echo '🌐 Getting Services...'
                                kubectl get svc

                                echo '📄 Describing Backend Deployment...'
                                kubectl describe deployment backend-deployment || true

                                echo '📄 Describing Frontend Deployment...'
                                kubectl describe deployment frontend-deployment || true
                            """
                        }
                    }
                }
                echo "✅ Kubernetes deployment completed and output printed!"
            }
        }


         stage('Get Frontend Service URL') {
            steps {
                script {
                    def frontendUrl = sh(script: "minikube service frontend-service --url", returnStdout: true).trim()
                    echo "🌍 Frontend is accessible at: ${frontendUrl}"
                }
            }
        }
    }

    

    post {
        always {
            echo "🔁 Pipeline execution completed."
        }
        success {
            echo "🎉 Success! Your MERN app has been deployed."
        }
        failure {
            echo "❌ Pipeline failed. Please check the logs."
        }
    }
}
