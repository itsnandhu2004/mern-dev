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

        stage('Wait for Frontend to be Available') {
            steps {
                withEnv(["KUBECONFIG=/var/lib/jenkins/.kube/config"]) {
                    script {
                        sh '''
                            echo "🌐 Getting Minikube IP..."
                            MINIKUBE_IP=$(minikube ip)
                            echo "✅ Minikube IP: $MINIKUBE_IP"

                            echo "🔍 Getting NodePort of frontend-service..."
                            NODE_PORT=$(kubectl get svc frontend-service -o=jsonpath='{.spec.ports[0].nodePort}')
                            echo "✅ NodePort: $NODE_PORT"

                            echo "⏳ Waiting for frontend service to become available..."
                            for i in {1..15}; do
                              curl -s --connect-timeout 2 http://$MINIKUBE_IP:$NODE_PORT > /dev/null && break
                              echo "Service not ready yet. Retrying..."
                              sleep 5
                            done

                            echo "✅ Frontend is now available at: http://$MINIKUBE_IP:$NODE_PORT"
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                def minikubeIp = sh(script: "minikube ip", returnStdout: true).trim()
                def nodePort = sh(script: "kubectl get svc frontend-service -o=jsonpath='{.spec.ports[0].nodePort}'", returnStdout: true).trim()
                echo "🎉 Deployment completed successfully! Visit http://${minikubeIp}:${nodePort} to access the app."
            }
        }
        failure {
            echo "❌ Build failed! Please check the console logs."
        }
    }
}
