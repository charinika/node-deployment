pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "charinika/myapp"  
        DOCKER_TAG = "${BUILD_NUMBER}"
        GITHUB_REPO = "https://github.com/charinika/node-deployment.git"  
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: "${GITHUB_REPO}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}", 
                        "--build-arg BUILD_VERSION=${DOCKER_TAG} .")
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    docker.withRegistry('', 'dockerhub-creds') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push('latest')
                    }
                }
            }
        }

        stage('Update Kubernetes Manifests') {
            steps {
                sh """
                    sed -i 's|image:.*|image: ${DOCKER_IMAGE}:${DOCKER_TAG}|' deployment.yaml
                    sed -i 's|value: ".*"|value: "${DOCKER_TAG}"|' deployment.yaml
                """
            }
        }

        stage('Deploy to Minikube') {
            steps {
                sh 'kubectl apply -f deployment.yaml'
                sh 'kubectl apply -f service.yaml'
                sh 'kubectl rollout status deployment/myapp-deployment'
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    echo "✅ Deployment complete!"
                    echo "📡 Service endpoints:"
                    kubectl get svc myapp-service
                    echo "📦 Pods:"
                    kubectl get pods
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
            echo "Access your app at: http://$(minikube ip):30007"
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}